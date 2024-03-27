import React, { useState } from 'react';
import { Layout, Menu, theme, Typography } from 'antd';
import { CalendarOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import PlayerTable from './tables/PlayerTable';
import MatchTable from './tables/MatchTable';
import TeamTable from './tables/TeamTable';

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [selectedMenuItem, setSelectedMenuItem] = useState('1');

    const handleMenuClick = (menuItem: string) => {
        setSelectedMenuItem(menuItem);
    };

    const menuItems = [
        { key: '1', icon: <UserOutlined />, label: 'Players' },
        { key: '2', icon: <CalendarOutlined />, label: 'Matches' },
        { key: '3', icon: <TeamOutlined />, label: 'Teams' },
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
            contentComponent = <PlayerTable />;
            pageTitle = 'Players'
            break;
        case '2':
            contentComponent = <MatchTable />;
            pageTitle = 'Matches'
            break;
        case '3':
            contentComponent = <TeamTable />;
            pageTitle = 'Teams'
            break;
        default:
            contentComponent = null;
            pageTitle = ''
    }

    return (
        <Layout>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
                style={siderStyle}
            >
                <div className="demo-logo-vertical">
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
        </Layout>
    );
};

export default App;