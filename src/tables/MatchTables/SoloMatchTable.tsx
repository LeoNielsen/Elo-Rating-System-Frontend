import { useState } from "react";
import { SoloMatch } from "../../Types/Types";
import { Button, Dropdown, Menu, message, Modal, Table } from "antd";
import { ColumnType } from "antd/es/table";
import MatchRatingModal from "../../modals/MatchRatingModal";
import { ExclamationCircleOutlined, MoreOutlined } from "@ant-design/icons";
import UserService from "../../Keycloak/UserService";
import { deleteSoloMatchById, updateSoloMatchById } from "../../API/Api";
import { useMutation, useQueryClient } from "react-query";
import NewMatchModal from "../../modals/NewMatchModal";

function SoloMatchTable({ isLoading, data }: { isLoading: boolean, data: SoloMatch[] | undefined }) {

    const [modalRatingsVisible, setModalRatingsVisible] = useState(false);
    const [rowId, setRowId] = useState<number | null>(null);

    const [openMenuRow, setOpenMenuRow] = useState<number | null>(null);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [matchToEdit, setMatchToEdit] = useState<SoloMatch | null>(null);

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteSoloMatchById,
        onMutate: () => {
            message.loading("Deleting solo match...");
        },
        onSuccess: () => {
            message.success("Solo match deleted");
            queryClient.invalidateQueries(["soloMatches"]);
        },
        onError: () => {
            message.error("Could not delete solo match");
        }
    });

    const { confirm } = Modal;
    const showConfirm = (title: string, onConfirm: () => void) => {
        confirm({
            title,
            icon: <ExclamationCircleOutlined />,
            content: "Are you sure? This action cannot be undone.",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: onConfirm
        });
    };

    const userName = UserService.getUsername();
    const isAdmin = UserService.hasRole("admin");

    const handleDelete = (id: number) => {
        showConfirm("Delete solo match?", () => deleteMutation.mutate(id));
    };

    const handleUpdate = (id: number) => {
        const match = data?.find(m => m.id === id);
        if (!match) return;

        setMatchToEdit(match);
        setEditModalVisible(true);
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

    const columns: ColumnType<SoloMatch>[] = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date"
        },
        {
            title: "Red Score",
            dataIndex: "redScore",
            key: "redScore",
            sorter: (a, b) => a.redScore - b.redScore
        },
        {
            title: "Blue Score",
            dataIndex: "blueScore",
            key: "blueScore",
            sorter: (a, b) => a.blueScore - b.blueScore
        },
        {
            title: "Red Player",
            dataIndex: "redPlayer",
            key: "redPlayer",
            sorter: (a, b) => a.redPlayer.localeCompare(b.redPlayer)
        },
        {
            title: "Blue Player",
            dataIndex: "bluePlayer",
            key: "bluePlayer",
            sorter: (a, b) => a.bluePlayer.localeCompare(b.bluePlayer)
        },
        {
            title: "",
            key: "actions",
            width: "1%",
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
                            ? [
                                {
                                    key: "edit",
                                    label: "Edit Solo Match",
                                    onClick: (e: any) => {
                                        e.domEvent.stopPropagation();
                                        handleUpdate(record.id);
                                        setOpenMenuRow(null);
                                    }
                                },
                                {
                                    key: "delete",
                                    label: "Delete Solo Match",
                                    danger: true,
                                    onClick: (e: any) => {
                                        e.domEvent.stopPropagation();
                                        handleDelete(record.id);
                                        setOpenMenuRow(null);
                                    }
                                }
                            ]
                            : [])
                    ]
                };

                return (
                    <Dropdown
                        menu={menu}
                        trigger={["click"]}
                        open={openMenuRow === record.id}
                        onOpenChange={(open) => setOpenMenuRow(open ? record.id : null)}
                    >
                        <Button type="text" icon={<MoreOutlined />} />
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
                pagination={{ hideOnSinglePage: true, pageSize: 20 }}
                columns={columns}
                rowClassName={(_, index) => (index % 2 === 1 ? "dark-row" : "")}
                bordered
                loading={isLoading}
                onRow={(record) => ({
                    onClick: () => setOpenMenuRow(record.id)
                })}
            />

            {modalRatingsVisible && (
                <MatchRatingModal
                    modalVisible={modalRatingsVisible}
                    setModalVisible={setModalRatingsVisible}
                    matchId={rowId!}
                    soloMatch={true}
                />
            )}

            {editModalVisible && (
                <NewMatchModal
                    modalVisible={editModalVisible}
                    setModalVisible={setEditModalVisible}
                    refetch={() => queryClient.invalidateQueries(["soloMatches"])}
                    soloRefetch={() => queryClient.invalidateQueries(["soloMatches"])}
                    activeTab="2"
                    mode="update"
                    matchToEdit={matchToEdit!}
                />
            )}
        </>
    );
}

export default SoloMatchTable;
