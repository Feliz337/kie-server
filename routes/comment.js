const env = require('../env');

const router = require('express').Router();
const Comment = require('../models/Comment');
const asyncHandler = require('express-async-handler');
const sd = require('silly-datetime');
const upush = require('../util/upush');
const axios = require('axios');

router.post('/', asyncHandler(async (req, res, next) => {
    const content = req.body.content;
    const comment = new Comment({
        content: content,
        timestamp: Date.now()
    });
    await comment.save();
    console.log(`[${sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}] New Comment Added! content=${content}`);

    const body = upush.generateBody(content);
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


    res.status(200).send('OK');
}));

router.get('/', asyncHandler(async (req, res) => {
    const comments = await Comment.aggregate([
        {$project:{_id:0, id:"$_id", content:1, timestamp:1}}
    ])
    res.status(200).json(comments)
}))

module.exports = router;
