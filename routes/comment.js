const env = require('../env');

const router = require('express').Router();
const Comment = require('../models/Comment');
const Device = require('../models/Device')
const asyncHandler = require('express-async-handler');
const sd = require('silly-datetime');
const upush = require('../util/upush');
const axios = require('axios');
const mongoose = require('mongoose');

router.post('/', asyncHandler(async (req, res, next) => {
    const content = req.body.content;
    const from = req.body.from;
    if (from === "") {
        res.status(400).send('ERR');
        return;
    }
    const comment = new Comment({
        content: content,
        from: from
    });
    await comment.save();
    console.log(`[${sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}] New Comment Added! content=${content}`);

    let devicesString = ""
    await Device.find({enabled: true}, (err, res) => {
        if (res.length.length === 0) return;
        res.forEach((it) => {
            devicesString += it.deviceToken;
            devicesString += ','
        })
    })
    if (devicesString.length !== 0 && devicesString.charAt(devicesString.length-1) === ',') {
        devicesString = devicesString.substring(0, devicesString.length-1);
    }
    if (devicesString !== "") {
        const body = upush.generateBody(content, devicesString);
        const sign = upush.generateSign(body);

        const params = {sign: sign}
        try {
            await axios.post(env.UPUSH_SEND_URL, body, {
                params: params,
            });
            console.log(`[${sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}] Send Request to UPush content=${content}`);

        } catch (e) {
            console.log(e.response);
        }
    }
    res.status(200).send('OK');
}));

router.get('/', asyncHandler(async (req, res) => {
    const comments = await Comment.aggregate([
        {$project: {_id: 0, id: "$_id", content: 1, createdAt: 1, from: 1}}
    ])
    res.status(200).json(comments)
}))

router.post('/enable', asyncHandler(async (req, res) => {
    // console.log("/enable called")
    const deviceToken = req.body.deviceToken
    if (deviceToken === "") {
        res.status(400).send('ERR');
        return;
    }

    const query = {'deviceToken': deviceToken};

    await Device.findOneAndUpdate(query, {deviceToken: deviceToken, enabled: true}, {upsert: true});
    res.status(200).send('OK')
}))

router.post('/disable', asyncHandler(async (req, res) => {
    // console.log("/disable called")
    const deviceToken = req.body.deviceToken
    if (deviceToken === "") {
        res.status(400).send('ERR');
        return;
    }

    const query = {'deviceToken': deviceToken};

    Device.findOneAndUpdate(query, {deviceToken: deviceToken, enabled: false}, {upsert: true}, (err, doc) => {
        if (err) res.status(400).send('ERR');
        res.status(200).send('OK')
    });

}));

module.exports = router;
