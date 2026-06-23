import { useState } from "react";
import { Match } from "../../Types/Types";
import { Button, Dropdown, Menu, message, Modal, Table } from "antd";
import { ColumnType } from "antd/es/table";
import MatchRatingModal from "../../modals/MatchRatingModal";
import { ExclamationCircleOutlined, MoreOutlined } from "@ant-design/icons";
import UserService from "../../Keycloak/UserService";
import { deleteMatchById } from "../../API/Api";
import { useMutation, useQueryClient } from "react-query";

function MatchTable({ isLoading, data }: { isLoading: boolean, data: Match[] | undefined }) {

    const [modalRatingsVisible, setModalRatingsVisible] = useState(false);
    const [rowId, setRowId] = useState<number | null>(null);

    const [openMenuRow, setOpenMenuRow] = useState<number | null>(null);

    const queryClient = useQueryClient();
    const deleteMatchMutation = useMutation({
        mutationFn: deleteMatchById,
        onSuccess: () => {
            message.success("Match deleted");
            queryClient.invalidateQueries(["matches"]);
        },
        onError: () => {
            message.error("Could not delete match");
        }
    });

    const { confirm } = Modal;
    const showConfirm = (title: string, onConfirm: () => void) => {
        confirm({
            title,
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to do this? This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: onConfirm,
        });
    };

    const userName: string = UserService.getUsername();
    const isAdmin: boolean = UserService.hasRole("admin");

    const handleDelete = (id: number) => {
        showConfirm('Delete latest 2v2 match?', () =>
            deleteMatchMutation.mutate(id)
        );
    };

    const isToday = (date: Date | string) => {
        const d = new Date(date);
        const now = new Date();
        return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth() &&
            d.getDate() === now.getDate()
        );
    };


    const columns: ColumnType<Match>[] = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'Red Score',
            dataIndex: 'redScore',
            key: 'redScore',
            sorter: (a, b) => a.redScore - b.redScore,
        },
        {
            title: 'Blue Score',
            dataIndex: 'blueScore',
            key: 'blueScore',
            sorter: (a, b) => a.blueScore - b.blueScore,
        },
        {
            title: 'Red Attacker',
            dataIndex: "redAtk",
            key: 'redAtk',
            sorter: (a, b) => a.redAtk.localeCompare(b.redAtk),
        },
        {
            title: 'Red Defender',
            dataIndex: "redDef",
            key: 'redDef',
            sorter: (a, b) => a.redDef.localeCompare(b.redDef),
        },
        {
            title: 'Blue Attacker',
            dataIndex: "blueAtk",
            key: 'blueAtk',
            sorter: (a, b) => a.blueAtk.localeCompare(b.blueAtk),
        },
        {
            title: 'Blue Defender',
            dataIndex: "blueDef",
            key: 'blueDef',
            sorter: (a, b) => a.blueDef.localeCompare(b.blueDef),
        },
        {
            title: '',
            key: 'actions',
            width: '1%',
            render: (_, record) => {
                const menu = {
                    items: [
                        {
                            key: "view",
                            label: "View Ratings",
                            onClick: (e: any) => {
                                e.domEvent.stopPropagation();
                                setRowId(record.id);
                                setModalRatingsVisible(true);
                                setOpenMenuRow(null);
                            }
                        },
                        ...(((record.createdBy === userName && isToday(record.date)) || isAdmin)
                            ? [{
                                key: "delete",
                                label: "Delete Match",
                                danger: true,
                                onClick: (e: any) => {
                                    e.domEvent.stopPropagation();
                                    handleDelete(record.id);
                                    setOpenMenuRow(null);
                                }
                            }]
                            : [])
                    ]
                };

                return (
                    <Dropdown
                        menu={menu}
                        trigger={['click']}
                        open={openMenuRow === record.id}
                        onOpenChange={(open) => setOpenMenuRow(open ? record.id : null)}
                    >
                        <Button
                            type="text"
                            icon={<MoreOutlined />}
                        />
                    </Dropdown>
                );
            }
        }

    ];

    const sortedData = data ? [...data].sort((a, b) => b.id - a.id) : [];

    return (
        <>
            <Table
                scroll={{ x: 350 }}
                dataSource={sortedData}
                pagination={{
                    hideOnSinglePage: true,
                    pageSize: 20,
                }}
                columns={columns}
                rowClassName={(record, index) => index % 2 === 1 ? 'dark-row' : ''}
                bordered={true}
                loading={isLoading}
                onRow={(record) => ({
                    onClick: () => setOpenMenuRow(record.id),
                })}
            />

            {modalRatingsVisible && (
                <MatchRatingModal
                    modalVisible={modalRatingsVisible}
                    setModalVisible={setModalRatingsVisible}
                    matchId={rowId!}
                    soloMatch={false}
                />
            )}
        </>
    );
}

export default MatchTable;
