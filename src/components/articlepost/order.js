import React, {Component} from 'react';
import DialogBase from './uicomponent/dialogbase';
import dialog from './toast/dialog';
import close_icon from './uicomponent/icon/close_icon.svg';

class Order extends Component {

	constructor(props) {
		super(props);
		var state = {
			orderid: window.__ORDER_META__.orderid || '',
			item: window.__ORDER_META__ || null,
			show: false,
			auto_open: true,
		};
		if (!state.orderid) {
			state.show = true;
		}
		if (this.props.show != undefined) {
			state.show = this.props.show;
		}
		this.state = state;

	}

	upNotAll() {
		window.__ORDER_DATA__ = window.__ORDER_DATA__.map((item) => {
			if(item.orderid==this.state.orderid && item.draft_num>0){
				item.draft_num -= 1;
			}
			return item;
		});

		this.props.parent._refs.ConnectInstructions.setOrder(null);

		this.setState({
			show: false,
			auto_open: false,
			orderid: '',
			item: null,
		});
	}

	close() {
		this.setState({
			show: false,
			auto_open: false
		});
	}

	show() {
		this.setState({
			show: true,
			auto_open: false
		});
	}

	render() {
		if (Object.prototype.toString.call(window.__ORDER_DATA__) !== '[object Array]' || !window.__ORDER_DATA__.length) {
			if (!this.state.auto_open) {
				dialog.toast('你没有订单可以关联');
			}
			return null;
		}
		return (
			<DialogBase show={this.state.show} parent={this} title={false}>
				{window.__ORDER_DATA__ ?
					<div className="order__modal">
						<div className="order-list-box">
							<div className="order-list-header">
								<h3>文章关联试用活动</h3>
								<div className="order-dialog-close" onClick={this.close.bind(this)}><img src={close_icon}/></div>
							</div>
							<div className="order-list-body">
								<div className="order-list-tips ft-14">你参与的试用活动中，还有活动待提交报告，请选择本次撰写文章要关联的试用活动：</div>
								<div className="order-list-wrap-parent">
									<ul className="order-list-wrap">
										{window.__ORDER_DATA__.map((item) => {
											var orderid = this.state.orderid;
											if (this.state.auto_open) {
												if (item.draft_num > 0) {
													return <li className={orderid == item.orderid ? 'on' : ''} key={item.orderid}
																		 onClick={this.location.bind(this, item)}>{item.title}{'（已有草稿 ' + item.draft_num + ' 篇）'}</li>;
												} else {
													return <li className={orderid == item.orderid ? 'on' : ''} key={item.orderid}
																		 onClick={this.location.bind(this, item)}>{item.title}</li>;
												}
											}
											return (
												item.draft_num > 0 ?
													<li className={'noselect ' + (orderid == item.orderid ? 'on' : '')}
															key={item.orderid}>{item.title}{'（已有草稿 ' + item.draft_num + ' 篇）'}</li> :
													<li className={orderid == item.orderid ? 'on' : ''} key={item.orderid}
															onClick={this.location.bind(this, item)}>{item.title}</li>
											);
										})}
									</ul>
								</div>
							</div>
							<div className="submit-btn-wrap">
								<div onClick={this.upNotAll.bind(this)} className="order-list-Original">以上都不是,我要撰写原创报告</div>
								<br/>
								<div onClick={this.ok.bind(this)}
										 className={"sub-btn" + (this.state.orderid ? '' : ' gray')}>{this.state.orderid ? '确定' : '关闭'}</div>
							</div>
						</div>
					</div>
					: ''}
			</DialogBase>
		);
	}

	location(item) {
		this.setState({
			orderid: item.orderid,
			item: item,
		});
	}

	clear() {
		this.setState({
			orderid: '',
			item: null,
		});
	}

	validation(_val) {
		return {
			orderid: this.state.orderid || ''
		};
	}

	ok() {
		if (
			window.__ORDER_META__.orderid!=this.state.orderid &&
			this.state.item.draft_num > 0
		) {
			window.onbeforeunload = null;
			if (this.state.item.url.indexOf('?') > -1) {
				window.location = this.state.item.url + '&source=user-article';
			} else {
				window.location = this.state.item.url + '?source=user-article';
			}
			return;
		}
		if (this.state.orderid) {
			this.props.parent._refs.ConnectInstructions.setOrder(this.state.item);
		}
		this.close();
	}
}

export default Order;








