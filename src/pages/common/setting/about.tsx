import Taro, {Component, Config} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'

import './about.scss'

import Panel from '../../../components/panel'

import data from '../../../utils/data'

export default class About extends Component {
  config: Config = {
    navigationBarTitleText: '关于'
  }
  
  state = {
    
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleCopyTextClick (text) {
    Taro.setClipboardData({data: text})
  }

  render () {
    return (
      <View>
        <View className='page'>
          <View className='logo'>
            <Image src={require('../../../asserts/images/robot.svg')}/>
          </View>
          <View className='intro'>
            <View className='intro-item'>[吉珠小助手]小程序为吉林大学珠海学院学生提供教务系统、校园卡、图书馆查询等服务。</View>
            <View className='intro-item'>如果你在使用的过程中遇到了问题或者有什么想法，欢迎通过关于页面的反馈选项告诉我。</View>
          </View>
          <Panel title='更新日志' marginBottom={0}>
            <View className='list'>
              <View className="list-item title">版本: {data.version} 日期: {data.versionReleaseDate}</View>
              {data.changeLog.map((log, index) => {
                return (
                  <View className='list-item' key={index}>{log}</View>
                )
              })}
            </View>
          </Panel>
          <Panel title='开源' marginBottom={0}>
            <View className='copy-text' onClick={this.handleCopyTextClick.bind(this, 'http://t.cn/ELtmhvK')}>http://t.cn/ELtmhvK</View>
          </Panel>
          <Panel title='感谢' marginBottom={0}>
            <View className='list'>
              <View className='list-item'>Taro</View>
              <View className='list-item'>Iconfont</View>
              <View className='list-item'>We川大</View>
              <View className='list-item'>微吉风</View>
              <View className='list-item'>课表</View>
            </View>
          </Panel>
          <Panel title='鸣谢' marginBottom={0}>
            <View className='list'>
              <View className='list-item'>@車前子：提供帮助以解决课表显示不正确的问题</View>
              <View className='list-item'>@史努比：提供帮助以开发借阅历史分页显示功能</View>
            </View>
          </Panel>
        </View>

        <View className='footer'>
          <View>吉珠小助手 · Made With Time</View>
        </View>
      </View>
    )
  }
}