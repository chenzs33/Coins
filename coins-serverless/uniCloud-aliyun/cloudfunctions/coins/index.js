'use strict';

const db = uniCloud.database();
const collection = db.collection('time');
const uniID = require('uni-id')
const dbCmd = db.command
const $ = dbCmd.aggregate

exports.main = async (event, context) => {

	let res = {};
	let params = {};
	params = event.params;

	switch (event.action) {
		case 'updateTime': {
			const { userID, date, indexBegin, indexEnd, tag, event } = params;
			await collection.where({ userID, date, index: { $gte: indexBegin,
						$lte: indexEnd } })
				.update({ tag, event })

			const count = await collection.aggregate()
				.match({ userID, $or: [{ "tag": 1 }, { "tag": 2 }, { "tag": 4 }] })
				.group({ _id: null, data: $.sum(1) })
				.end()

			res = await uniID.updateUser({
				uid: userID,
				coins: count.data[0].data
			})
			break;
		}
		case 'getTime': {
			const { userID, date } = params;
			res = collection.where({ userID, date }).get().then((doc) => {
				if (doc.data.length == 0) {
					//新增48个时间块
					var times = new Array();
					for (let i = 0; i < 48; i++) {
						let time = new Object({
							index: i,
							tag: 7,
							event: '',
							date: date,
							userID: userID
						})
						times.push(time);
					}
					//加入到time表中
					return collection.add(times)
				} else {
					return { code: 0, msg: '查询成功', list: doc.data }
				}
			});
			break;
		}

		//按时间区间统计
		case 'stats': {
			const { userID, dateBegin, dateEnd } = params;
			res = collection.aggregate()
				.match({ userID, date: { $gte: dateBegin, $lte: dateEnd } })
				.group({ _id: "$tag", data: $.sum(1) })
				.sort({ _id: 1 })
				.end()
			break;
		}
		//每日获取金币
		case 'coinsToday': {
			const { userID, date } = params;
			res = collection.aggregate()
				.match({ userID, date, $or: [{ "tag": 1 }, { "tag": 2 }, { "tag": 4 }] })
				.group({ _id: null, data: $.sum(1) })
				.end()
			break;
		}
		default: {
			res = {
				code: 8,
				msg: "请求非法"
			}
		}

	}

	return res
};
