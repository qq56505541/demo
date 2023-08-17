import PropTypes from '@yh/ta404-ui/es/_util/vue-types'
import { getSlotOptions, } from '@yh/ta404-ui/lib/_util/props-util'
import { warning, } from '@yh/ta404-ui/lib/vc-util/warning'

export const AvatarListItemProps = {
  tips: PropTypes.string.def(''),
  src: PropTypes.string.def(''),
}

const Item = {
  __ANT_AVATAR_CHILDREN: true,
  name: 'avatarListItem',
  props: AvatarListItemProps,
  created () {
    warning(getSlotOptions(this.$parent).__ANT_AVATAR_LIST, 'AvatarListItem must be a subcomponent of AvatarList')
  },
  render () {
    const AvatarDom = <ta-avatar size={this.$parent.size} src={this.src} />
    return this.tips && <ta-tooltip title={this.tips}>{AvatarDom}</ta-tooltip> || <AvatarDom />
  },
}

export default Item
