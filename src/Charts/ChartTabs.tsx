import { Tabs, TabsProps } from 'antd'
import Chart from './Chart'
import { getChartData, getMonthlyChartData, getSoloChartData } from '../API/Api'
import { chartData } from '../Types/Types'
import { useQuery } from 'react-query'
import Records from './Records'

function ChartTabs() {

    const ratings = useQuery<chartData[]>('ratings', getChartData);
    const ratingsSolo = useQuery<chartData[]>('ratingsSolo', getSoloChartData);
    const ratingsMonthly = useQuery<chartData[]>('ratingsMonthly', getMonthlyChartData);

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: '2v2',
            children: <Chart name={"2v2"} data={ratings.data} isLoading={ratings.isLoading} />
        }, {
            key: '2',
            label: '1v1',
            children: <Chart name={"1v1"} data={ratingsSolo.data} isLoading={ratingsSolo.isLoading} />
        }, {
            key: '3',
            label: 'Monthly 2v2',
            children: <Chart name={"Monthly 2v2"} data={ratingsMonthly.data} isLoading={ratingsMonthly.isLoading} />
        },{
            key: '4',
            label: 'Records',
            children: <Records />
        },
    ]

    return (
        <div className="App">
            <Tabs items={tabs} defaultActiveKey='1' />
        </div>
    )
}

export default ChartTabs