const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  // findUserById(id, res, (res, user) => {
  //   user.entries++;
  //   res.json(user.entries);
  // })
  db('users').where('id', '=', id)
    // .update({
    //   entries: 
    // })
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json('unable to get entries'))
    
}

module.exports = { handleImage };