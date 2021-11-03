import * as userApi from "@/api/user";

function Table(column){
  this.column=column
  this.row = undefined
  this.list = []
}

Table.prototype={
  constructor: Table
}

Object.defineProperty(Table.prototype, 'radius',{
  configurable: false,
  value:'28px',
  writable: false
})

Object.defineProperty(Table.prototype, 'zeroBorder',{
  configurable: false,
  value:'0px solid',
  writable: false
})

Table.prototype.tableBodyCellStyle= function({rowIndex, columnIndex}){
  if(this.list.length==0 || this.list==null) {
    console.log("list empty")
    return
  }

  this.row=this.list.length
  let borderStyle={}
  //最后一列没有右边边框
  if(columnIndex==this.column-1) {
    borderStyle['border-right']=Table.prototype.zeroBorder
  }
  //最后一行没有底边框
  if(rowIndex==this.row-1) {
    borderStyle['border-bottom']=Table.prototype.zeroBorder
  }

  //两个底角变成圆角
  if(rowIndex==this.row-1 && columnIndex==0) {
    borderStyle['border-bottom-left-radius']=Table.prototype.radius
  }
  if(rowIndex==this.row-1 && columnIndex==this.column - 1) {
    borderStyle['border-bottom-right-radius']=Table.prototype.radius
  }
  return borderStyle
}

Table.prototype.tableHeaderCellStyle=function({rowIndex, columnIndex}) {
  let borderStyle={}
  //两个顶角变成圆角
  if(rowIndex==0 && columnIndex==0) {
    borderStyle['border-top-left-radius']=Table.prototype.radius
  }
  if(rowIndex==0 && columnIndex==this.column - 1) {
    borderStyle['border-top-right-radius']=Table.prototype.radius
    borderStyle['border-right']=Table.prototype.zeroBorder

  }
  return borderStyle
}

export {Table}




