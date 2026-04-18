// handleRender.ts
import type { SliderProps } from 'rc-slider'
import { HandleTooltip } from '.'

export const HandleRender: SliderProps['handleRender'] = (node, props) => (
    <HandleTooltip value={props.value} visible={props.dragging}>
        {node}
    </HandleTooltip>
)
