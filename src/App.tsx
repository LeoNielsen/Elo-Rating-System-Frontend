import React, { useEffect, useRef, useState } from 'react';
import { Layout, Menu, theme, Typography } from 'antd';
import { CalendarOutlined, LineChartOutlined, SmileOutlined, TeamOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';
import PlayerTable from './tables/PlayerTable';
import MatchTables from './tables/MatchTables/MatchTables';
import TeamTable from './tables/TeamTable';
import PlayerRankingTables from './tables/PlayerRankingTables/PlayerRankingTables';
import Chart from './Charts/Chart';
import MatchRandomizer from './MatchRandomizer/MatchRandomizer';
import Admin from './Admin/Admin';
import PRoute from './Admin/PRoute';

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [selectedMenuItem, setSelectedMenuItem] = useState('1');
    const [collapsed, setCollapsed] = useState(false);
    const [broken, setBroken] = useState(false);
    const siderRef = useRef<HTMLDivElement | null>(null);

    const handleMenuClick = (menuItem: string) => {
        setSelectedMenuItem(menuItem);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!broken) {
                setCollapsed(false);
                return;
            }

            if (siderRef.current && !siderRef.current.contains(event.target as Node)) {
                if (!collapsed) {
                    setCollapsed(true);
                }
            }
        };

        // Add event listener for mousedown
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener when the component unmounts or dependencies change
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [collapsed, broken]);


    const menuItems = [
        { key: '1', icon: <TrophyOutlined />, label: 'Player Ranking' },
        { key: '2', icon: <CalendarOutlined />, label: 'Matches' },
        { key: '3', icon: <TeamOutlined />, label: 'Teams' },
        { key: '4', icon: <UserOutlined />, label: 'Players' },
        { key: '5', icon: <LineChartOutlined />, label: 'Stats' },
        { key: '6', icon: <SmileOutlined />, label: 'Match Randomizer' },
        { key: '7', icon: <SmileOutlined />, label: 'admin' },
    ];

    const siderStyle = {
        minHeight: '100vh',
    };

    const contentStyle = {
        padding: 24,
        minHeight: 360,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
    };

    let contentComponent: React.ReactNode;
    let pageTitle: string;
    switch (selectedMenuItem) {
        case '1':
            contentComponent = <PlayerRankingTables />;
            pageTitle = 'Players'
            break;
        case '2':
            contentComponent = <MatchTables />;
            pageTitle = 'Matches'
            break;
        case '3':
            contentComponent = <TeamTable />;
            pageTitle = 'Teams'
            break;
        case '4':
            contentComponent = <PlayerTable />;
            pageTitle = 'Players'
            break;
        case '5':
            contentComponent = <Chart />;
            pageTitle = 'Stats'
            break;
        case '6':
            contentComponent = <MatchRandomizer />;
            pageTitle = 'Match Randomizer'
            break;
        case '7':
            contentComponent = <PRoute children={<Admin />}/>;
            pageTitle = 'admin'
            break;
        default:
            contentComponent = null;
            pageTitle = ''
    }

    return (
        <Layout>
            <Sider
                breakpoint="sm"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    setBroken(broken)
                }}
                collapsed={collapsed}
                onCollapse={(collapsed) => {
                    setCollapsed(collapsed);
                }}
                ref={siderRef}

                style={{...siderStyle,
                    zIndex: broken ? 1000 : 'auto',
                    position: broken ? 'absolute' : 'relative',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src="/JNbold.png"
                        alt="Logo"
                        style={{ width: '100px', height: '100px' }}
                    />
                </div>


                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[selectedMenuItem]}
                    onClick={({ key }) => handleMenuClick(key.toString())}

                >
                    {menuItems.map((menuItem) => (
                        <Menu.Item key={menuItem.key} icon={menuItem.icon}>
                            {menuItem.label}
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout style={{ backgroundColor: '#eaf2f8' }}>
                <Header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, background: colorBgContainer }}>
                    <Typography.Title>{pageTitle}</Typography.Title>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={contentStyle}>{contentComponent}</div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Foosball Elo Rating System ©2024 Created by Leo
                </Footer>
            </Layout>
        </Layout >
    );
};

export default App;
