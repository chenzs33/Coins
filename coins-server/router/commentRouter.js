const express = require('express')
const router = express.Router()
const Discover = require('../db/model/discoverModel')
const Comment = require('../db/model/commentModel')
const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;


//评论
router.post('/add', (req, res) => {
    let bool, comment = [];
    new Comment(req.body).save().then(function (doc1) {
        console.log("doc1==>", doc1)
        Discover.findOne({
            _id: req.body.discoverID
        }).exec(function (err, doc2) {
            console.log("doc2==>", doc2)
            if (err) {
                res.send({
                    code: 3001,
                    msg: '评论失败'
                })
                return;
            }
            comment = doc2.comment;
            comment.unshift(doc1._id);
            Discover.update({
                _id: req.body.discoverID
            }, {
                comment: comment,
                $inc: {
                    "commentNum": 1
                }
            }).exec(function () {
                res.send({
                    code: 2000,
                    msg: '评论成功!'
                })
            })
        })
    })
})


router.post('/getCommet', (req, res) => {
    let discoverID = req.body.discoverID

    let page = req.body.page || 1 //设置默认值
    let pageSize = req.body.pageSize || 10
    let count = 0

    Comment.aggregate([
        {
            $match: {
                discoverID: discoverID
            }
        },  {
            $lookup: {
                from: "users",
                localField: "userID",
                foreignField: "userID",
                as: "userInfo"
            }
        }
    ]).then((list) => {
        res.send({
            code: 2000,
            msg: '查询成功',
            list: list
        })
    })

})

module.exports = router