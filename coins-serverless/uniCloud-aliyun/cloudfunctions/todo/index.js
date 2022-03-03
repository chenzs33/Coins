'use strict';

const db = uniCloud.database();
const collection = db.collection('todo');
const dbCmd = db.command
const $ = dbCmd.aggregate

exports.main = async (event, context) => {
	
	let res = {};
	let params = {};
	params = event.params;
	
	switch(event.action){
		case 'addTodo': {
			const {userID,date,completed,name} = params;
			res = collection.add({userID, date, completed, name})
			break;
		}
		
		case 'delTodo': {
			const {_id} = params;
			res = collection.doc(_id).remove()
			break;
		}
		
		case 'getTodo': {
			const {userID,date} = params;
			res = collection.where({userID, date}).get();
			break;
		}
		
		case 'toggleTodo': {
			const {_id,userID,completed} = params;
			res = collection.where({_id}).update({userID,completed});
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
