// Require in certain models through destructuring
const { User, Thought, Reaction } = require('../models');

const thoughtController = {

  // Get /api/thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      })
  },

  // Get /api/thoughts/:id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id' });
          return;
        }
        res.json(dbThoughtData);
      });
  },
  // POST /api/thoughts
  // expected body:
  // {
  //   "thoughtText": "hi",
  //   "username": "Andrew",
  // }
  createThought({ body}, res) {
    Thought.create(body)
      .then(dbThoughtData => {
        User.findOneAndUpdate(
          { username: body.username },
          { $push: { thoughts: dbThoughtData._id }},
          { new: true }
        )
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => res.json(err));
      })
      .catch(err => res.status(400).json(err));
  },

  // PUT /api/thoughts/:id
    // expected body should include at least one of the following attributes:
    // {
    //     "thoughtText": "hi",
    //     "username": "Andrew",
    //     "thoughtId": "[insert random numbers here]" 
    // }
    updateThought({ params, body }, res) {
      Thought.findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true}
      )
      .then(dbThoughtData => {
        if (!dbThoughtdata) {
          res.status(404).json({ message: 'No thought found with this id' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
    },

    // DELETE /api/thoughts/:id
    deleteThought({ params }, res) {
      // delete the thought
      Thought.findOneAndDelete({ _id: params.id })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'no thought found with this id'});
          return;
        }
        // delete the reference to deleted thought in user's thought array
        User.findOneAndUpdate(
          { username: dbThoughtData.username },
          { $pull: { thoughts: params.id }}
        )
        .then(() => {
          res.json({ message: 'Successfully deleted the thought '});
        })
        .catch(err => res.status(500).json(err));
      })
      .catch(err => res.status(500).json(err));
    },
    // POST /api/thoughts/:id/reactions
    addReaction({ params, body }, res) {
      Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $addToSet: { reactions: body }},
        { new: true, runValidators: true}
      )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(500).json(err));
    },

      // DELETE /api/thoughts/:id/reactions
    // expected body should include at least one of the following attributes:
    // {
    //     "reactionId": "Andrew" 
    // }
    deleteReaction({ params, body}, res) {
      Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: body.reactionId }}},
        { new: true, runValidators: true}
      )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'no thought found with this id' });
          return;
        }
        res.json({ message: 'Successfully deleted the reaction' });
      })
      .catch(err => res.status(500).json(err));
    },
}

module.exports = thoughtController;