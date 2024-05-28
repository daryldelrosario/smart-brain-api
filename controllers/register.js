const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, name, password } = req.body;
  if(!email || !name || !password) {
    return res.status(400).json('incorrect form submission')
  }

  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx.select('*').from('login').where('email', '=', email)
      .then(existingEmail => {
        if(existingEmail.length > 0) {
          return Promise.reject('Email already exists');
        } else {
          return trx.insert({
            hash: hash,
            email: email
          })
          .into('login')
          .returning('email')
          .then(loginEmail => {
            return trx('users')
              .returning('*')
              .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
              })
              .then(user => {
                res.json(user[0]);
              });
          });
        }
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
  .catch(err => {
    console.log(err);
    if(err === "Email already exists") {
      res.status(400).json("Email already exists");
    } else {
      res.status(400).json("Unable to register");
    }
  })

  // bcrypt.hash(password, null, null, function(err, hash) {
  //   console.log(hash);
  // });

  // database.users.push({
  //   id: "125",
  //   name: name,
  //   email: email,
  //   entries: 0,
  //   joined: new Date()
  // });

  
    .catch(err => {
      console.log(err);
      res.status(400).json('unable to register')
    })
}

module.exports = {
  handleRegister: handleRegister
};

