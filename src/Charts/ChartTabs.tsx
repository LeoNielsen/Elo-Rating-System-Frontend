import { Tabs, TabsProps } from 'antd'
import Chart from './Chart'
import { getChartData, getMonthlyChartData, getSoloChartData } from '../API/Api'
import { chartData } from '../Types/Types'
import { useQuery } from 'react-query'
import Records from './Records'
import { useState } from 'react'

function ChartTabs() {

    const [activeKey, setActiveKey] = useState('1')

    const ratings = useQuery<chartData[]>(
        ['ratings'],
        getChartData,
        { enabled: activeKey === '2' }
    );

    const ratingsSolo = useQuery<chartData[]>(
        ['ratingsSolo'],
        getSoloChartData,
        { enabled: activeKey === '3' }
    );

    const ratingsMonthly = useQuery<chartData[]>(
        ['ratingsMonthly'],
        getMonthlyChartData,
        { enabled: activeKey === '4' }
    );

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: 'Records',
            children: <Records />
        }, {
            key: '2',
            label: '2v2 Chart',
            children: <Chart name={"2v2 Chart"} data={ratings.data} isLoading={ratings.isLoading} />
        }, {
            key: '3',
            label: '1v1 Chart',
            children: <Chart name={"1v1 Chart"} data={ratingsSolo.data} isLoading={ratingsSolo.isLoading} />
        }, {
            key: '4',
            label: 'Monthly 2v2 Chart',
            children: <Chart name={"Monthly 2v2 Chart"} data={ratingsMonthly.data} isLoading={ratingsMonthly.isLoading} />
        }
    ]

    return (
        <div className="App">
            <Tabs items={tabs} defaultActiveKey='1' activeKey={activeKey} onChange={(key) => setActiveKey(key)} />
        </div>
    )
}

export default ChartTabs