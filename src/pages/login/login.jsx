import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
// import { requestLogin } from '../../api/api.js'
import './login.less';
import { observer } from 'mobx-react';
import _state from './login.state';
const FormItem = Form.Item;

//创建canvas画布
const creatCanvas = () => {
    /************canvas的使用****************/
    class Circle {
        //创建对象
        //以一个圆为对象
        //设置随机的 x，y坐标，r半径，_mx，_my移动的距离
        //this.r是创建圆的半径，参数越大半径越大
        //this._mx,this._my是移动的距离，参数越大移动
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.r = Math.random() * 10;
            this._mx = Math.random();
            this._my = Math.random();
        }
        //canvas 画圆和画直线
        //画圆就是正常的用canvas画一个圆
        //画直线是两个圆连线，为了避免直线过多，给圆圈距离设置了一个值，距离很远的圆圈，就不做连线处理
        drawCircle(ctx) {
            ctx.beginPath();
            //arc() 方法使用一个中心点和半径，为一个画布的当前子路径添加一条弧。
            ctx.arc(this.x, this.y, this.r, 0, 360)
            ctx.closePath();
            //ctx.fillStyle = 'rgba(204, 204, 204, 0.3)';
            ctx.fillStyle = 'rgba(217, 211, 227, .6)';
            ctx.fill();
        }
        drawLine(ctx, _circle) {
            let dx = this.x - _circle.x;
            let dy = this.y - _circle.y;
            let d = Math.sqrt(dx * dx + dy * dy)
            if (d < 150) {
                ctx.beginPath();
                //开始一条路径，移动到位置 this.x,this.y。创建到达位置 _circle.x,_circle.y 的一条线：
                ctx.moveTo(this.x, this.y);   //起始点
                ctx.lineTo(_circle.x, _circle.y);   //终点
                ctx.closePath();
                //ctx.strokeStyle = 'rgba(204, 204, 204, 0.3)';
                ctx.strokeStyle = 'rgba(185, 197, 209, .6)';
                ctx.stroke();
            }
        }
        // 圆圈移动
        // 圆圈移动的距离必须在屏幕范围内
        move(w, h) {
            this._mx = (this.x < w && this.x > 0) ? this._mx : (-this._mx);
            this._my = (this.y < h && this.y > 0) ? this._my : (-this._my);
            this.x += this._mx / 2;
            this.y += this._my / 2;
        }
    }
    //鼠标点画圆闪烁变动
    class currentCirle extends Circle {
        // constructor(x, y) {
        //     super(x, y)
        // }
        drawCircle(ctx) {
            ctx.beginPath();
            //注释内容为鼠标焦点的地方圆圈半径变化
            //this.r = (this.r < 14 && this.r > 1) ? this.r + (Math.random() * 2 - 1) : 2;
            this.r = 8;
            ctx.arc(this.x, this.y, this.r, 0, 360);
            ctx.closePath();
            //ctx.fillStyle = 'rgba(0,0,0,' + (parseInt(Math.random() * 100) / 100) + ')'
            //          ctx.fillStyle = 'rgba(255, 77, 54, 0.6)'
            ctx.fillStyle = 'rgba(220, 224, 229,.6)'
            ctx.fill();
        }
    }
    //更新页面用requestAnimationFrame替代setTimeout
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    let circles = [];
    let current_circle = new currentCirle(0, 0)
    let draw = function () {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < circles.length; i++) {
            circles[i].move(w, h);
            circles[i].drawCircle(ctx);
            for (let j = i + 1; j < circles.length; j++) {
                circles[i].drawLine(ctx, circles[j])
            }
        }
        if (current_circle.x) {
            current_circle.drawCircle(ctx);
            for (var k = 1; k < circles.length; k++) {
                current_circle.drawLine(ctx, circles[k])
            }
        }
        requestAnimationFrame(draw)
    }
    let init = function (num) {
        for (var i = 0; i < num; i++) {
            circles.push(new Circle(Math.random() * w, Math.random() * h));
        }
        draw();
    }
    window.addEventListener('load', init(60));
    window.onmousemove = function (e) {
        e = e || window.event;
        current_circle.x = e.clientX;
        current_circle.y = e.clientY;
    }
    window.onmouseout = function () {
        current_circle.x = null;
        current_circle.y = null;
    };
}

class NormalLoginForm extends Component {

    //用户登录
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                    'username': values.userName,
                    'password': values.password
                }
                _state.do_login(params).then(res => {
                    if (res.success) {
                        this.props.onLongin(true);
                        this.props.history.push('/index');
                    }
                });
                // requestLogin(params).then(res => {
                //     if(!res.success) {
                //         message.error(res.message);
                //         return;
                //     }
                //     //反馈登录成功
                //     this.props.onLongin(true);
                //     this.props.history.push('/index');
                // })
            }
        });
    }

    componentDidMount() {
        creatCanvas();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="form-box">
                    <h3 className="title">欢迎登录 - 圭喆租车</h3>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入您的用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入您的密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住用户名</Checkbox>
                            )}
                            <a className="login-form-forgot" href="">忘记密码</a>
                            <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                        </FormItem>
                    </Form>
                </div>

                <canvas id="canvas" className='canvas'></canvas>
            </div>
        );
    }
}

const Login = Form.create()(NormalLoginForm);

export default Login