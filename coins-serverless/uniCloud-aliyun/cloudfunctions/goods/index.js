'use strict';

const db = uniCloud.database();
const collection = db.collection('commodity');

exports.main = async (event, context) => {
	let res = {};
	let params = {};
	params = event.params;
	
	switch(event.action){
		case 'addGoods':{
			const {title,imgUrl,condition,num} = params;
			res = collection.add({title,imgUrl,condition,num});
			break;
		}
		case 'getGoods':{
			res = collection.get();
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
}
