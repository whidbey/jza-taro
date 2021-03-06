import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button} from '@tarojs/components'

import './custom.scss'

interface ISchedule {
  courseName: string,
  location: string,
  color: string,
  teacher: string,
  flex: number,
  isTouchMove: boolean,
  oddOrEven: number,
  during: string,
  session: string,
}

export default class Sample extends Component {
  config: Config = {
    navigationBarTitleText: '自定义课表管理'
  }
  
  state = {
    schedule: [] as ISchedule[],
    startX: 0,
    from: '',
  }

  componentWillMount () {
    const schedule = Taro.getStorageSync('mySchedule')
    schedule.forEach((item) => {
      item.isTouchMove = false
      return item
    })

    const params = this.$router.params

    this.setState({schedule: schedule, from: params.from})
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleManualAdd () {
    const { from } = this.state
    if (from === 'schedule') { Taro.navigateBack() }
    else if (from === 'search') {Taro.navigateTo({url: '/pages/edu/schedule/schedule?from=search'})}
  }

  handleTouchStart (e) {
    const { schedule } = this.state

    schedule.forEach((item) => {
      if (item.isTouchMove) {
        item.isTouchMove = false
      }
    })

    
    this.setState({
      schedule: schedule,
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
    })
  }

  handleTouchEnd (e) {
    const { schedule, startX } = this.state
    const index = e.currentTarget.dataset.index
    const touchMoveX = e.changedTouches[0].clientX

    schedule.forEach((item, i) => {
      item.isTouchMove = false
      if (i !== index) { return }
      if (touchMoveX > startX) {
        item.isTouchMove = false
      } else {
        item.isTouchMove = true
      }
    })

    this.setState({schedule: schedule})
  }

  parseText (str) {
    const array = str.split(',')
    let text = ''
    if (array.length === 1) {
      text = array[0]
    } else {
      text = array[0] + '-' + array[array.length-1]
    }
    return text
  }

  handleClickInfo (e) {
    const { schedule } = this.state
    const index = e.currentTarget.dataset.index
    const course = schedule[index]

    const duringText = this.parseText(course.during)
    const sessionText = this.parseText(course.session)

    let oddText = ''
    switch (course.oddOrEven) {
      case 0:
        oddText = '非单双周'
        break
      case 1:
        oddText = '单周'
        break
      case 2: 
        oddText = '双周'
        break
    }

    const contentArrary = [
      course.courseName,
      course.teacher,
      course.location,
      sessionText + ' 节',
      duringText + ' 周',
    ]

    if (oddText !== '') {
      contentArrary.push(oddText)
    }
    
    const content: Array<any> = contentArrary.map((c, index, arrary) => {
      return index != (arrary.length - 1) ? c + ' \\ ' : c
    })

    schedule[index].isTouchMove = false
    this.setState({schedule: schedule})
    Taro.showModal({title: '', content: content.join(''), showCancel: false})
  }

  handleClickDelete (e) {
    const { schedule } = this.state
    const index = e.currentTarget.dataset.index
    
    schedule.splice(index, 1)

    this.setState({schedule: schedule})
    Taro.setStorageSync('mySchedule', schedule)
    Taro.eventCenter.trigger('indexRemount')
    Taro.eventCenter.trigger('scheduleCoreRemount')
    Taro.showToast({title: '成功删除自定义课程', icon: 'none'})
  }

  render () {
    const { schedule } = this.state

    return (
      <View className="padding20">
        {schedule.map((item, index) => {
          return (
            <View className={`box ${item.isTouchMove? 'touch-move__active': ''}`} key={index} data-index={index} onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd}>
              <View className="left">
                <View className="item">
                  <View className="value">{item.courseName}</View>
                </View>
                <View className="item">
                  <View className="value">{item.teacher} • {item.location}</View>
                </View>
              </View>
              <View className="right">
                <View className="info" data-index={index} onClick={this.handleClickInfo}>详情</View>
                <View className="delete" data-index={index} onClick={this.handleClickDelete}>删除</View>
              </View>
            </View>
          )
        })}
        {schedule.length === 0
        ? (
          <View className="empty">
            <View className="empty-text">没有自定义课程哦</View>
          </View>
        )
        : (
          <View className="tips">
            <View>向左滑动进行更多操作</View>
          </View>
        )
        }
        <Button className='btn' onClick={this.handleManualAdd}>手动添加</Button>
      </View>
    )
  }
}