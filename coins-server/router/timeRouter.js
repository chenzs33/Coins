const express = require('express')
const router = express.Router()
const Time = require('../db/model/timeModel')
const User = require('../db/model/userModel')

router.post('/update', (req, res) => {
    let { userID, date, indexBegin, indexEnd, tag, event } = req.body

    Time.updateMany({ userID, date, index: { $gte: indexBegin, $lte: indexEnd } }, { tag, event })
        .then(() => {

            return Time.aggregate([
                { $match : { "userID" : userID, $or:[{"tag":1},{"tag":2},{"tag":4} ]}},
                { $group: { _id : null, count : {$sum : 1}}},
            ])

            // res.send({ code: 2000, msg: '更新成功' })
        })
        .then((data)=>{
            return User.update({"userID":userID},{"coins":data[0].count})
        })
        .then(()=>{
            res.send({ code: 2000, msg: '更新成功' })
        })
        .catch((err) => {
            res.send({ code: 3001, msg: '更新失败', err })
        })
})


router.post('/getTimeInfo', (req, res) => {
    let { userID, date } = req.body

    Time.find({ $and: [{ date }, { userID }] }).then((docs)=> {
        //如果找不到则自动新增
        if (docs.length == 0) {
                //新增48个时间块
                var times = new Array();
                for (i = 0; i < 48; i++) {
                    let time = new Time({
                        index: i,
                        tag: 7,
                        event: '',
                        date:date,
                        userID:userID
                    })
                    times.push(time);
                }
                //加入到Time表中
                Time.insertMany(times).then((data) => {
                    res.send({ code: 2000, msg: '查询成功', list: data })
                })

        }
        else {
            res.send({ code: 2000, msg: '查询成功', list: docs })
        }
    })

})


//按时间区间统计
router.post('/stats', (req, res) => {

    let { userID, dateBegin, dateEnd } = req.body

    Time.aggregate([
        { $match : { userID, date: { $gte: dateBegin, $lte: dateEnd } }},
        { $group: { _id : "$tag", data : {$sum : 1}}},
        { $sort: { _id : 1 } },
    ]).then((data)=>{
        //删除空白项统计
        var result = data.find(item=>item._id==7)
        var index = data.indexOf(result)
        data.splice(index,1)

        res.send({ code: 2000, msg: '查询成功', list: data })
    })
})


// 每日获取金币
router.post('/statisticsCoin', (req, res) => {

    let { userID, date } = req.body

    Time.aggregate([
        { $match : { "userID" : userID, "date": date, $or:[{"tag":1},{"tag":2},{"tag":4} ]}},
        { $group: { _id : null, count : {$sum : 1}}},
    ]).then((data)=>{
        res.send({ code: 2000, msg: '统计成功', count: data })
    }).catch((err)=>{
        res.send({code: 3001, msg:'统计失败',err})
    })
})

//统计所有用户数据
router.post('/statsAllData', (req, res) => {

    // let { dateBegin, dateEnd } = req.body

    Time.aggregate([
        // { $match : { date: { $gte: dateBegin, $lte: dateEnd } }},
        { $group: { _id : "$tag", value : {$sum : 1}}},
        { $sort: { _id : 1 } },
    ]).then((data)=>{
        //删除空白项统计
        var result = data.find(item=>item._id==7)
        var index = data.indexOf(result)
        data.splice(index,1)

        data.forEach((value , index) => {
            if(value["_id"]==0) {value['name'] = '拖延'}
            if(value["_id"]==1) {value['name'] = '工作'}
            if(value["_id"]==2) {value['name'] = '学习'}
            if(value["_id"]==3) {value['name'] = '放松'}
            if(value["_id"]==4) {value['name'] = '运动'}
            if(value["_id"]==5) {value['name'] = '琐事'}
            if(value["_id"]==6) {value['name'] = '娱乐'}
        })

        res.send({ code: 2000, msg: '查询成功', list: data })
    })
})



module.exports = router