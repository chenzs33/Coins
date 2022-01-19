const express = require("express");
const router = express.Router();
const Food = require("../db/model/foodModel");

/**
 * @api {post} /food/add 添加Food
 * @apiName addFood
 * @apiGroup Food
 *
 * @apiParam {String} name 名称.

 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post("/add", (req, res) => {
  let { name, price, desc, typename, typeid, img } = req.body;
  //判断参数是否正确
  Food.insertMany({ name, price, desc, typename, typeid, img })
    .then((data) => {
      res.send({ err: 0, msg: "添加成功" });
    })
    .catch((err) => {
      res.send(err);
      res.send({ err: -1, msg: "添加失败" });
    });
});

/**
 * @api {post} /food/getInfoByTypeid 分类查询
 * @apiName getInfoByTypeid
 * @apiGroup Food
 *
 * @apiParam {Number} name 类别.

 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post("/getInfoByTypeid", (req, res) => {
  let { typeid } = req.body;
  Food.find({ typeid })
    .then((data) => {
      res.send({ err: 0, msg: "查询ok", list: data });
    })
    .catch((err) => {
      res.send(err);
      res.send({ err: -1, msg: "查询失败" });
    });
});

/**
 * @api {post} /food/getInfoBykw 关键字模糊查询
 * @apiName getInfoBykw
 * @apiGroup Food
 *
 * @apiParam {String} name 名称.
 * @apiParam {String} typename 类别.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post("/getInfoBykw", (req, res) => {
  let { kw } = req.body;
  let reg = new RegExp(kw); //创建一个正则表达式，匹配关键字
  // Food.find({name:{$regex:reg}})
  Food.find({ $or: [{ name: { $regex: reg } }, { desc: { $regex: reg } }] }) //名字或描述
    .then((data) => {
      res.send({ err: 0, msg: "查询ok", list: data });
    })
    .catch((err) => {
      res.send(err);
      res.send({ err: -1, msg: "查询失败" });
    });
});

/**
 * @api {post} /food/del 删除Food
 * @apiName del
 * @apiGroup Food
 *
 * @apiParam {String} _id id
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post("/del", (req, res) => {
  let { _id } = req.body;
  //单个删除 ，多个删除（{_id:{[]}}）
  Food.remove({ _id })
    .then((data) => {
      res.send({ err: 0, msg: "del ok" });
    })
    .catch((err) => {
      res.send(err);
      res.send({ err: -1, msg: "del 失败" });
    });
});

/**
 * @api {post} /food/update 修改Food
 * @apiName update
 * @apiGroup Food
 *
 * @apiParam {String} name 名称.

 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post("/update", (req, res) => {
  let { name, price, desc, typename, typeid, img, _id } = req.body;
  Food.updateOne({ _id }, { name, price, desc, typename, typeid, img })
    .then((data) => {
      res.send({ err: 0, msg: "修改成功" });
    })
    .catch((err) => {
      res.send(err);
      res.send({ err: -1, msg: "修改失败" });
    });
});

/**
 * @api {post} /food/getInfoByPage 分页查询
 * @apiName getInfoByPage
 * @apiGroup Food
 *
 * @apiParam {Number} pageSize 每页数据.
 * @apiParam {Number} page 页码.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post("/getInfoByPage", (req, res) => {
  let page = req.body.page || 1; //设置默认值
  let pageSize = req.body.pageSize || 2;

  let count = 0;

  Food.find()
    .then((list) => {
      count = list.length; //总条数
      return Food.find()
        .limit(Number(pageSize))
        .skip(Number((page - 1) * pageSize));
    })
    .then((data) => {
      let allpage = Math.ceil(count / pageSize);
      res.send({
        err: 0,
        msg: "查询ok",
        info: { list: data },
        count: count,
        allpage: allpage,
      });
    })
    .catch((err) => {
      res.send(err);
      res.send({ err: -1, msg: "查询失败" });
    });
});

//测试查询
router.get("/getInfo", (req, res) => {
  let count = 0;

  Food.find()
    .then((list) => {
      count = list.length; //总条数
      return Food.find();
    })
    .then((data) => {
      res.send({ err: 0, msg: "查询ok", info: { list: data }, count: count });
    })
    .catch((err) => {
      res.send(err);
      res.send({ err: -1, msg: "查询失败" });
    });
});

module.exports = router;
