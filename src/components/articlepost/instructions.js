

import React , { Component } from 'react';
var httpHost;
if (process.env.NODE_ENV == 'production') {
	httpHost = window.location.href.match(/http:\/\/(\w+\.jiguo\.com)/i)[1];
} else {
	httpHost = 'http://localhost:8080';
}

class Instructions extends Component{

  constructor(props) {
	super(props);
	this.state = {
	  writing_required:false,
	  link_event_product:true,
	  order: window.__ORDER_META__ || {}
	};

  }
  render(){
	return (
	  <div className="content__right-item" id="content__right-item-bottom">
		<div className="content__right-header content__tabcard clear">
		  <div onClick={ e => this.checkWritingRequired.bind(this)() } className={"content__tabcard-item " + (this.state.writing_required?"on":"")}><span className="line">撰稿必读</span></div>
		  <div onClick={ e => this.checkLinkEventProduct.bind(this)() } className={"content__tabcard-item " + (this.state.link_event_product?"on":"")}><span className="line">关联试用产品</span></div>
		</div>
		<div className="content__right-inner">
		  <div className="instructions__wrap">
			{this.state.writing_required?
			  <div>
				<p>为帮您顺利完成优秀报告，极果君准备了<a href={"http://www.jiguo.com/article/article/49454.html"} target="_blank">《极果投稿须知》</a>，介绍极果投稿流程及报告审核标准。如有其他疑问，请联系极果平平微信：jiguopp或拨打400-001-9217</p>
			  </div>:
			  <div>
				{this.state.order.orderid?
				  <div className="instructions__link-product">
					<div className="clear">
					  <div className="instructions__product-img">
						<img src={"http://s1.jiguo.com/"+this.state.order.cover+"/230x230"} />
					  </div>
					  <div className="instructions__product-text">
						<div className="title">{this.state.order.event_title}</div>
						<div className="type">{this.state.order.buying_name}</div>
					  </div>
					</div>
					<div className="instructions__product-tips">
					  如您参与过多个试用活动，请认真核对以上关联的活动是否与正在撰写的文章正确匹配
					</div>
					<input type="hidden" name="orderid" value={this.state.order.orderid} />
					<div style={{marginTop:10}}>
					  <a href="javascript:;" onClick={this.changeLinkProduct.bind(this)}>修改关联产品</a>
					  {/*<a href="javascript:;" onClick={this.canselLinkProduct.bind(this)} className="ml10">取消关联产品</a>*/}
					</div>
				  </div>:
				  <div>
					<div className="instructions__product-tips">
					  此篇文章没有关联试用活动，将会作为一篇原创投稿提交
					</div>
					<div style={{marginTop:10}}><a href="javascript:;" onClick={this.changeLinkProduct.bind(this)}>关联产品</a></div>
				  </div>
				}
			  </div>
			}
		  </div>
		</div>
	  </div>
	);
  }
  canselLinkProduct(){
    this.setState({
	  order:{}
	});
	this.props.clearOrder();
  }
  checkWritingRequired(){
    this.setState({
	  writing_required:true,
	  link_event_product:false
	});
  }
  checkLinkEventProduct(){
	this.setState({
	  writing_required:false,
	  link_event_product:true
	});
  }

  validation(){
	if( this.state.orderid ){
	  return {
		orderid:this.state.orderid
	  };
	}
	return {};
  }
  changeLinkProduct(){
    this.props.changeOrder();
  }
  setOrder(order){
	this.setState({
	  order:order||{}
	});
  }
}

export default Instructions;








