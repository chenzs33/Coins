'use strict';

const db = uniCloud.database();
const collection = db.collection('feedback');
const dbCmd = db.command
const $ = dbCmd.aggregate

exports.main = async (event, context) => {
	
	let res = {};
	let params = {};
	params = event.params;
	
	switch(event.action){
		case 'addFeedback':{
			const {userID,username,feedbackText} = params;
			res = collection.add({ userID,username,feedbackText });
			break;
		}
		default:{
			res = {
				code:8,
				msg:"请求非法"
			}
		}
		
	}
	
	return res
};
