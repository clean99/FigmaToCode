export enum componentName {
    input,
    button,
    checkbox,
    avatar,
    radio,
    select,
    Alert,
    list,
    background
}
export const isUI = (name:string) => {
  console.log('isUI'+name)
    return Object.values(componentName).includes(name);
}

export const recognizeAntdUI = (name: string, text: string) => {
    console.log(name)
    switch(name){
        case 'input': return `<Input placeholder="${text}" />`
        case 'button': return `<Button type="${text === 'submit'|| text === '提 交' || text === '登 录'?"primary":"defualt"}" >${text}</Button>`
        case 'checkbox': return `<Checkbox>${text}</Checkbox>`
        case 'list': return `
        <List
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={['item1','item2','item3']}
      renderItem={item => (
        <List.Item>
          <Typography.Text mark>[ITEM]</Typography.Text> {item}
        </List.Item>
      )}
    />
        `
        case 'avatar': return `<Avatar>${text}</Avatar>`
        case 'Alert': return '<Alert message="Success Text" type="success" />'
        case 'radio': return `<Radio>${text}</Radio>`
        case 'select': return `
        <Select defaultValue="${text}" style={{ width: 120 }}>
        <Option value="select2">select2</Option>
        <Option value="select3">select3</Option>
        <Option value="disabled" disabled>
          Disabled
        </Option>
      </Select>
        `
        default: return text
    }
}