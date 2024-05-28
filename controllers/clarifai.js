// const fetch = require('node-fetch');

const handleClarifaiCall = (req, res) => {
  const { imageURL } = req.body;

  const PAT = process.env.CLARIFAI_PAT;
  const USER_ID = process.env.CLARIFAI_USER_ID;
  const APP_ID = process.env.CLARIFAI_APP_ID;
  const MODEL_ID = process.env.CLARIFAI_MODEL_ID;
  const MODEL_VERSION_ID = process.env.CLARIFAI_MODEL_VERSION_ID;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": imageURL
                }
            }
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, requestOptions)
          .then(response => {
            if(!response.ok) {
              throw new Error('Clarifai API error: ' + response.statusText);
            }
            return response.json();
          })
          .then(result => {
            const regions = result.outputs[0].data.regions;
            res.json(regions);
          })
          .catch(error => {
            console.log('error', error);
            res.status(400).json("unable to work with api");
          });
}

module.exports = {
  handleClarifaiCall
};