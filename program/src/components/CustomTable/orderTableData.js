const orderTableData = []; // 所有订单数据


for (let i = 0; i < 100; i++) {
  orderTableData.push({
    id: i + 1,
    guest_id: Math.random() * 100 >> 0,
    guest_name: '客户' + i,
    order_sn: 'DD000000098000000',
    receiver: '叶辰',
    mobile: '18673873978',
    address: '北京市北城区北城北',
    remarks: '请及时发货',
    total_money: 2148.0,
    son_order_sn: 'DD000000098000001',
    supplier_id: Math.random() * 100 >> 0,
    supplier_name: '供应商' + i,
    goods_id: 1,
    model: 'AK-47',
    number: 10,
    order_status: '已确认收货',
    univalent: 19.9,
    price_discount: 0.0,
    max_delivery_time: 7,
    pay_status: '已支付',
    commission: Math.random() * 50 >> 0,
    add_time: 1518875092.263431 + (Math.random() * 1000000),
    progress: Math.random() * 2 >> 0,
  });
}

export default orderTableData;
