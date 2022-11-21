const { User, Thought } = require('../models');

module.exports = {
  getUsers(req,res) { 
    User.find()
    .populate('thoughts')
    .populate('friends')
    .then((users) => res.status(200).json(users))
    .catch((e) => res.status(500).json(e))
  },
  getSingleUser(req,res) { 
    User.findOne({_id: req.params.userId})
    .select('-__v')
    .populate('thoughts')
    .populate('friends')
    .then((user) => 
      !user 
        ? res.status(404).json({message:'No user with that id'})
        : res.status(200).json(user)
    )
    .catch((e)=>res.status(500).json(e))
  },
  createUser(req,res) { 
    User.create(req.body) 
    .then((user) => res.status(200).json(user))
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    })
  },
  deleteUser(req,res){ 
    User.findOneAndDelete({_id: req.params.userId})
    .then((user) => 
      !user
        ? res.status(404).json({message: "No user with that id."})
        : Thought.deleteMany({_id: {$in: user.thoughts}})
    )
    .then(() => res.json({message: 'User deleted.'}))
    .catch((e)=> res.status(500).json(e))
  },
  updateUser(req,res) { 
    User.findOneAndUpdate(
      {_id: req.params.userId},
      {$set: req.body},
      {
        runValidators: true,
        new: true
      }
    )
    .then ((user) => 
    !user
      ? res.status(404).json({ message: 'No user with this id!' })
      : res.json(user)
    )
    .catch ((e) => res.status(500).json(e));
  },
  addFriend(req,res) { 
    User.findOneAndUpdate(
      {id: req.params.userId},
      {$addToSet: {friends: req.params.friendId}},
      {runValidators:true, new:true}
    )
    .then((user) => 
      !user
        ? res.status(404).json({message: "No user of that id"})
        : res.json(user)
    )
    .catch((e) => res.status(500).json(e))
  },
  deleteFriend(req,res) {
    User.findOneAndUpdate(
      {_id: req.params.userId},
      {$pull: {friends: req.params.friendId}},
      {runValidators: true, new: true}
    )
    .then((user) => 
      !user
        ? res.status(404).json({message: "No user of that id"})
        : res.json(user)
    )
    .catch((e) => res.status(500).json(e))
  }
};