import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Dropdown, Layout, Menu, MenuProps, theme, Typography } from 'antd';
import { CalendarOutlined, LineChartOutlined, LockOutlined, SmileOutlined, TeamOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';
import PlayerTable from './tables/PlayerTable';
import MatchTables from './tables/MatchTables/MatchTables';
import TeamTable from './tables/TeamTable';
import PlayerRankingTables from './tables/PlayerRankingTables/PlayerRankingTables';
import Chart from './Charts/Chart';
import MatchRandomizer from './MatchRandomizer/MatchRandomizer';
import Admin from './Admin/Admin';
import UserService from './Keycloak/UserService';
import AdminProtectedRoute from './ProtectedRoutes/AdminProtectedRoute';
import { useMutation, useQuery } from 'react-query';
import { createPlayer, getAllPlayers } from './API/Api';
import { Player } from './Types/Types';
import UserProfilModal from './modals/UserProfilModal';


const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [selectedMenuItem, setSelectedMenuItem] = useState('1');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [isKeycloakReady, setIsKeycloakReady] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState('');
    const [showUserProfile, setShowUserProfile] = useState(false)
    const [collapsed, setCollapsed] = useState(false);
    const [broken, setBroken] = useState(false);
    const siderRef = useRef<HTMLDivElement | null>(null);

    const { data, refetch } = useQuery("Players", getAllPlayers);
    const { mutateAsync: createPlayerMutation } = useMutation(createPlayer);

    const checkIfPlayerExists = useCallback((input: string) => {
        return data && data.some((player: Player) => player.nameTag.toUpperCase() === input.toUpperCase());
    }, [data]);

    const handleMenuClick = (menuItem: string) => {
        setSelectedMenuItem(menuItem);
    };

    const handleLogin = () => {
        UserService.doLogin()
    }

    const handleLogout = () => {
        UserService.doLogout()
        setIsLoggedIn(UserService.isLoggedIn());
        setIsAdmin(UserService.hasRole(false));
        setUserName('')
    }

    useEffect(() => {
        const initialize = async () => {
            if (!UserService.isKeycloakInitialized) {
                await UserService.initKeycloak();
                const loggedIn = UserService.isLoggedIn();
                setIsLoggedIn(loggedIn);
                setIsKeycloakReady(true);
                if (loggedIn) {
                    setIsAdmin(UserService.hasRole('admin'));
                    setUserName(UserService.getUsername);
                }
            }
        };

        initialize();
    }, []);

    useEffect(() => {
        if (userName !== '') {
            if (!checkIfPlayerExists(userName)) {
                createPlayerMutation(
                    { nameTag: userName.toUpperCase() }
                )
                refetch()
            }
        }
    }, [userName, checkIfPlayerExists, createPlayerMutation, refetch])

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
        ...(isAdmin ? [{ key: '7', icon: <LockOutlined />, label: 'Admin' }] : []),
    ];

    const profilDropdownItems: MenuProps['items'] = [
        ...isLoggedIn ? [
            { key: '0', label: <div onClick={() => setShowUserProfile(true)}>Profile</div> },
            { key: '1', label: <div onClick={handleLogout}>Logout</div> },
        ] : [
            { key: '0', label: <div onClick={handleLogin}>Login</div> },
        ],
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
            contentComponent = <AdminProtectedRoute children={<Admin />} />;
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

                style={{
                    ...siderStyle,
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
                    {(isKeycloakReady && (
                        <Dropdown menu={{ items: profilDropdownItems }} trigger={['click']}>
                            <Avatar
                                size="large"
                                style={{
                                    backgroundColor: '#1890ff',
                                    position: 'absolute',
                                    right: 24,
                                    cursor: 'pointer',
                                }}
                                icon={<UserOutlined />}
                            />
                        </Dropdown>
                    ))}
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={contentStyle}>{contentComponent}</div>
                    <UserProfilModal setModalVisible={setShowUserProfile} modalVisible={showUserProfile} ></UserProfilModal>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Foosball Elo Rating System ©2024 Created by Leo
                </Footer>
            </Layout>
        </Layout >
    );
};

export default App;
