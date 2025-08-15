import { Tabs, TabsProps } from 'antd'
import React from 'react'
import Chart from './Chart'
import SoloChart from './SoloChart'
function ChartTabs() {

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: '2v2',
            children: <Chart />
        }, {
            key: '2',
            label: '1v1',
            children: <SoloChart />
        }, {
            key: '3',
            label: 'Monthly 2v2',
            children: <Chart />
        },
    ]

    return (
        <div className="App">
            <Tabs items={tabs} defaultActiveKey='1' />
        </div>
    )
}

export default ChartTabs