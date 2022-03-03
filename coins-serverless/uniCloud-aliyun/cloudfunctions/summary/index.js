'use strict';

const db = uniCloud.database();
const collection = db.collection('summary');
const dbCmd = db.command
const $ = dbCmd.aggregate

exports.main = async (event, context) => {
	
	let res = {};
	let params = {};
	params = event.params;
	
	switch(event.action){
		case 'getSummary':{
			const {userID,date} = params;
			res = collection.where({$and: [{ date }, { userID }]}).get().then((data)=>{
				if(data.data.length == 0){
					return collection.add({ date, userID })
				}
				return data.data
			})
			.then((data)=>{
				return { code: 0, msg: '查询成功', list: data }
			})
			break;
		}
		
		case 'updateSummary':{
			const {target, book, movie, significant, goodSentence, stupid, point, _id} = params;
			res = collection.where({ _id })
							.update({ target, book, movie, significant, goodSentence, stupid, point });
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
