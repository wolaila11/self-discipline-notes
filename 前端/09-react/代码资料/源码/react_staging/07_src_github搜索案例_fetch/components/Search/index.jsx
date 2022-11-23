import React, { Component } from 'react'
import PubSub from 'pubsub-js'
// import axios from 'axios'

export default class Search extends Component {

	search = async()=>{
		//获取用户的输入(连续解构赋值+重命名)
		const {keyWordElement:{value:keyWord}} = this
		//发送请求前通知List更新状态
		PubSub.publish('atguigu',{isFirst:false,isLoading:true})
		//#region 发送网络请求---使用axios发送
		/* axios.get(`/api1/search/users2?q=${keyWord}`).then(
			response => {
				//请求成功后通知List更新状态
				PubSub.publish('atguigu',{isLoading:false,users:response.data.items})
			},
			error => {
				//请求失败后通知App更新状态
				PubSub.publish('atguigu',{isLoading:false,err:error.message})
			}
		) */
		//#endregion
			
		//发送网络请求---使用fetch发送（未优化）
		/* fetch(`/api1/search/users2?q=${keyWord}`).then(
			//==补充== 
			//如果.then中指定成功或失败的回调函数的返回值为promise对象,就把该对象作为.then返回的promise实例对象，promiseState的值为成功或失败
			//如果.then中指定成功或失败的回调函数的返回值为非promise对象，promise对象的状态就为成功，PromiseResult值就为返回的非promise值（举例
			：如果断开浏览器的网络，下面代码如果没有return new Promise(()=>{})会得到'联系服务器失败了' '获取数据成功了'，这也就是error=>{}函数中return new Promise(()=>{})存在的原因）
			//promise对象的值：
			//1.promise实例对象中的PromiseResult属性保存着任务成功或失败的结果。
			//2.promise实例对象中的PromiseState保存着状态，成功或失败，即fulfilled或rejected	
			//==end==

			response => {
				console.log('联系服务器成功了');
				return response.json()
			},
			error => {
				console.log('联系服务器失败了',error);
				return new Promise(()=>{})
			}
		).then(
			response => {console.log('获取数据成功了',response);},
			error => {console.log('获取数据失败了',error);}
		) */

		//发送网络请求---使用fetch发送（优化）
		//==补充==
		//await只接受成功返回的结果
		//关注分离设计想
		//==end==
		try {
			const response= await fetch(`/api1/search/users2?q=${keyWord}`)
			const data = await response.json()
			console.log(data);
			PubSub.publish('atguigu',{isLoading:false,users:data.items})
		} catch (error) {
			console.log('请求出错',error);
			PubSub.publish('atguigu',{isLoading:false,err:error.message})
		}
	}

	render() {
		return (
			<section className="jumbotron">
				<h3 className="jumbotron-heading">搜索github用户</h3>
				<div>
					<input ref={c => this.keyWordElement = c} type="text" placeholder="输入关键词点击搜索"/>&nbsp;
					<button onClick={this.search}>搜索</button>
				</div>
			</section>
		)
	}
}

