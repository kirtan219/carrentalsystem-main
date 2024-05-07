const express = require('express'); 						
const passport = require('passport');						
const APIStrategy = require('ibmcloud-appid').APIStrategy;		
const app = express();
app.use(passport.initialize());
passport.use(new APIStrategy({
	oauthServerUrl: "https://au-syd.appid.cloud.ibm.com/oauth/v4/5fb6b9e7-dd68-4a97-81a9-194c48c88be5",
}));

// Protect the whole app
app.use(passport.authenticate(APIStrategy.STRATEGY_NAME, {
	session: false
}));

// The /api/data API used to retrieve protected data
app.get('/api/data', (req, res) => {
	res.json({
		data: 12345
	});
});
app.listen(8001, () => {
    console.log('Listening on http://localhost:8001');
});
