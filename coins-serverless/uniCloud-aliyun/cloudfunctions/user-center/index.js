'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	
	let res = {};
	let params = {};
	params = event.params;
	
	switch(event.action){
		case 'register':{
			const {username,password} = params;
			res = await uniID.register({username,password});
			break;
		}
		case 'login':{
			const {username,password} = params;
			res = await uniID.login({username,password,queryField: ['username', 'email', 'mobile']});
			break;
		}
		case 'login_wx':{
			const {code} = params;
			res = await uniID.loginByWeixin({code});
			break;
		}
		case 'logout':{
			res = await uniID.logout(event.uniIdToken);
			break;
		}
		case 'getUserInfo':{
			const {uid} = params;
			res = await uniID.getUserInfo({uid});
			break;
		}
		case 'changePwd':{
			const {uid,oldPassword,newPassword} = params;
			res = await uniID.updatePwd({uid,oldPassword,newPassword})
			break;
		}
		case 'changeAvatar':{
			const {uid,avatar} = params;
			res = await uniID.setAvatar({uid,avatar});
			break;
		}
		case 'changeNickname':{
			const {nickname,uid} = params;
			res = await uniID.updateUser({uid,nickname});
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
