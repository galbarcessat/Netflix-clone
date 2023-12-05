import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { SOCKET_EVENT_UPDATE_BOARD, socketService } from './socket.service.js'
import { userService } from './user.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'boardDB'
const BASE_URL = 'board'

export const boardService = {
    query,
    getBoardById,
    update,
    save,
    remove,
    _createBoards,
}

// _createBoards()

// General Update function
async function update(type, boardId, groupId = null, taskId = null, { key, value }) {
    try {
        const board = await getBoardById(boardId)
        const activityType = getActivityType(key)
        let groupIdx, taskIdx, activity

        switch (type) {
            case 'board':
                if (!boardId) throw new Error('Error updating')
                const oldBoard = board[key]
                board[key] = value

                if (key === 'groups' || key === 'kanbanCmpsOrder' || key === 'cmpsOrder') break
                activity = await createActivity({ type: activityType, from: oldBoard, to: value }, board._id)
                board.activities.unshift(activity)
                break

            case 'group':
                if (!groupId) throw new Error('Error updating')
                groupIdx = board.groups.findIndex(group => group.id === groupId)
                const oldGroup = board.groups[groupIdx][key]
                board.groups[groupIdx][key] = value

                activity = await createActivity({ type: activityType, from: oldGroup[key], to: value }, board._id, groupId)
                board.activities.unshift(activity)
                break

            case 'task':
                if (!taskId) throw new Error('Error updating')
                groupIdx = board.groups.findIndex(group => group.id === groupId)
                taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === taskId)
                const oldTask = board.groups[groupIdx].tasks[taskIdx][key]
                board.groups[groupIdx].tasks[taskIdx][key] = value

                activity = await createActivity({ type: activityType, from: oldTask, to: value }, boardId, groupId, taskId)
                board.activities.unshift(activity)
                break

            default:
                break
        }

        let updatedBoard = await httpService.put(`${BASE_URL}/${boardId}`, board)
        // return await storageService.put(STORAGE_KEY, board)
        socketService.emit(SOCKET_EVENT_UPDATE_BOARD, boardId)
        return updatedBoard
    }
    catch (err) {
        console.log(err)
        throw err
    }

}
// Board functions
async function query() {
    return httpService.get(BASE_URL, null)
    // return await storageService.query(STORAGE_KEY)
}

async function getBoardById(boardId, filterBy = { txt: '', person: null }, sortBy) {
    let boards = await query()
    let board = boards.find(board => board._id === boardId)
    // let board = await storageService.get(STORAGE_KEY, boardId)
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        board.groups = board.groups.map((group) => {
            const filteredTasks = group.tasks.filter((task) => regex.test(task.title))

            // If there are matching tasks or the group title matches, include the group
            if (filteredTasks.length > 0 || regex.test(group.title)) {
                if (filteredTasks.length > 0) {
                    group.tasks = filteredTasks
                }
                return group;
            }
            // If no matching tasks and group title doesn't match, exclude the group
            return null
        }).filter((group) => group !== null) // Remove groups without matching tasks or title
    }

    if (filterBy.person) {
        board.groups = board.groups.map((group) => {
            const filteredTasks = group.tasks.filter((task) => task.memberIds.includes(filterBy.person._id))

            if (filteredTasks.length > 0) {
                group.tasks = filteredTasks
                return group;
            }

            return null;
        }).filter((group) => group !== null)
    }

    if (sortBy) {
        board.groups = board.groups.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();

            if (titleA < titleB) {
                return -1
            } else if (titleA > titleB) {
                return 1
            } else {
                return 0
            }
        })

    }

    return board
}

async function save(board) {
    return await httpService.post(BASE_URL, board)
    // return await storageService.post(STORAGE_KEY, board)
}

async function remove(boardId) {
    return httpService.delete(`${BASE_URL}/${boardId}`, boardId)
    // return await storageService.remove(STORAGE_KEY, boardId)
}

function _createBoards() {
    // let boards = utilService.loadFromStorage(STORAGE_KEY)
    let boards = httpService.get(BASE_URL, null)
    if (!boards || !boards.length) {
        boards =
            [
                {
                    title: "Robot dev proj",
                    isStarred: false,
                    archivedAt: 1589983468418,
                    createdBy: {
                        _id: "u101",
                        fullname: "Abi Abambi",
                        imgUrl: "https://cdn1.monday.com/dapulse_default_photo.png"
                    },
                    style: {
                        backgroundImage: ""
                    },
                    labels: [
                        {
                            id: "l100",
                            title: "",
                            color: "explosive"
                        },
                        {
                            id: "l101",
                            title: "Done",
                            color: "done-green"
                        },
                        {
                            id: "l102",
                            title: "Progress",
                            color: "working_orange"
                        },
                        {
                            id: "l103",
                            title: "Stuck",
                            color: "stuck-red"
                        }
                    ],
                    members: [
                        {
                            _id: "u101",
                            fullname: "Gal Ben Natan",
                            imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619973/GalImg_z8ivzb.png"
                        },
                        {
                            _id: "u102",
                            fullname: "Omer Vered",
                            imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619996/OmerImg_svk1xe.png"
                        },
                        {
                            _id: "u103",
                            fullname: "Nati Feldbaum",
                            imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698620005/NatiImg_qvxcqb.png"
                        }
                    ],
                    groups: [
                        {
                            id: "g101",
                            title: "Group 1",
                            archivedAt: 1589983468418,
                            tasks: [
                                {
                                    id: "c101",
                                    title: "Replace logo",
                                    comments: [],
                                    priority: "Medium",
                                    status: "Done",
                                    dueDate: undefined,
                                    memberIds: []
                                },
                                {
                                    id: "c102",
                                    title: "Add Samples",
                                    comments: [],
                                    priority: "Low",
                                    status: "Progress",
                                    dueDate: undefined,
                                    memberIds: []
                                }
                            ],
                            style: "grass_green"
                        },
                        {
                            id: "g102",
                            title: "Group 2",
                            tasks: [
                                {
                                    id: "c103",
                                    title: "Do that",
                                    comments: [],
                                    archivedAt: 1589983468418,
                                    priority: "High",
                                    status: "Stuck",
                                    dueDate: undefined,
                                    memberIds: []
                                },
                                {
                                    id: "c104",
                                    title: "Help me",
                                    status: "Progress",
                                    priority: "Critical",
                                    dueDate: 16156215211,
                                    description: "description",
                                    comments: [
                                        {
                                            id: "ZdPnm",
                                            txt: "also @yaronb please CR this",
                                            createdAt: 1590999817436,
                                            byMember: {
                                                _id: "u101",
                                                fullname: "Gal Ben Natan",
                                                imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619973/GalImg_z8ivzb.png"
                                            }
                                        }
                                    ],
                                    checklists: [
                                        {
                                            id: "YEhmF",
                                            title: "Checklist",
                                            todos: [
                                                {
                                                    id: "212jX",
                                                    title: "To Do 1",
                                                    isDone: false
                                                }
                                            ]
                                        }
                                    ],
                                    memberIds: ["u101"],
                                    labelIds: ["l101", "l102"],
                                    byMember: {
                                        _id: "u101",
                                        username: "Gal",
                                        fullname: "Gal Ben Natan",
                                        imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619973/GalImg_z8ivzb.png"
                                    },
                                    style: {
                                        backgroundColor: "done-green"
                                    }
                                },
                                {
                                    id: "c105",
                                    title: "Change that",
                                    status: "Done",
                                    priority: "",
                                    dueDate: 16156215211,
                                    description: "description",
                                    comments: [
                                        {
                                            id: "ZdPnm",
                                            txt: "also @yaronb please CR this",
                                            createdAt: 1590999817436,
                                            byMember: {
                                                _id: "u101",
                                                fullname: "Gal Ben Natan",
                                                imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619973/GalImg_z8ivzb.png"
                                            }
                                        }
                                    ],
                                    checklists: [
                                        {
                                            id: "YEhmF",
                                            title: "Checklist",
                                            todos: [
                                                {
                                                    id: "212jX",
                                                    title: "To Do 1",
                                                    isDone: false
                                                }
                                            ]
                                        }
                                    ],
                                    memberIds: ["u101"],
                                    labelIds: ["l103", "l101"],
                                    byMember: {
                                        _id: "u101",
                                        username: "Gal",
                                        fullname: "Gal Ben Natan",
                                        imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619973/GalImg_z8ivzb.png"
                                    },
                                    style: {
                                        backgroundColor: "done-green"
                                    }
                                }
                            ],
                            style: "bright-blue"
                        }
                    ],
                    activities: [],
                    priorities: [

                        {
                            id: "p100",
                            title: "Critical",
                            color: "blackish"
                        },
                        {
                            id: "p101",
                            title: "High",
                            color: "dark_indigo"
                        },
                        {
                            id: "p102",
                            title: "Medium",
                            color: "indigo"
                        },
                        {
                            id: "p103",
                            title: "Low",
                            color: "bright-blue"
                        },
                        {
                            id: "p105",
                            title: "",
                            color: "explosive"
                        }

                    ],
                    cmpsOrder: [
                        "side",
                        "title",
                        "members",
                        "status",
                        "priority",
                        "dueDate",
                        "timeline",
                        "files"
                    ]
                },
                {
                    title: "AI dev proj",
                    isStarred: true,
                    archivedAt: 1589983468520,
                    createdBy: {
                        _id: "u102",
                        fullname: "Joe Johnson",
                        imgUrl: "https://cdn1.monday.com/dapulse_default_photo.png"
                    },
                    style: {
                        backgroundImage: ""
                    },
                    labels: [
                        {
                            id: "l100",
                            title: "",
                            color: "explosive"
                        },
                        {
                            id: "l101",
                            title: "Done",
                            color: "done-green"
                        },
                        {
                            id: "l102",
                            title: "Progress",
                            color: "working_orange"
                        },
                        {
                            id: "l103",
                            title: "Stuck",
                            color: "stuck-red"
                        }
                    ],
                    members: [
                        {
                            _id: "u101",
                            fullname: "Gal Ben Natan",
                            imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619973/GalImg_z8ivzb.png"
                        },
                        {
                            _id: "u102",
                            fullname: "Omer Vered",
                            imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619996/OmerImg_svk1xe.png"
                        },
                        {
                            _id: "u103",
                            fullname: "Nati Feldbaum",
                            imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698620005/NatiImg_qvxcqb.png"
                        }
                    ],
                    groups: [
                        {
                            id: "g103",
                            title: "Group A",
                            archivedAt: 1589983468520,
                            tasks: [
                                {
                                    id: "c105",
                                    title: "Design Layout",
                                    comments: [],
                                    priority: "Medium",
                                    status: "Done",
                                    memberIds: []
                                },
                                {
                                    id: "c106",
                                    title: "Refactor Code",
                                    comments: [],
                                    priority: "Low",
                                    status: "Progress",
                                    memberIds: []
                                }
                            ],
                            style: "grass_green"
                        },
                        {
                            id: "g104",
                            title: "Group B",
                            tasks: [
                                {
                                    id: "c107",
                                    title: "Brainstorm ideas",
                                    archivedAt: 1589983468520,
                                    comments: [],
                                    priority: "High",
                                    status: "Stuck",
                                    memberIds: []
                                },
                                {
                                    id: "c108",
                                    title: "Document features",
                                    status: "Progress",
                                    priority: "Critical",
                                    description: "brief description",
                                    comments: [
                                        {
                                            id: "ZdOlo",
                                            txt: "@janed please review this",
                                            createdAt: 1590999817537,
                                            byMember: {
                                                _id: "u103",
                                                fullname: "Jane Doe",
                                                imgUrl: "https://cdn1.monday.com/dapulse_default_photo.png"
                                            }
                                        }
                                    ],
                                    checklists: [
                                        {
                                            id: "ZEpqS",
                                            title: "TaskList",
                                            todos: [
                                                {
                                                    id: "313kY",
                                                    title: "To Do A",
                                                    isDone: true
                                                }
                                            ]
                                        }
                                    ],
                                    memberIds: ["u103"],
                                    labelIds: ["l103", "l104"],
                                    byMember: {
                                        _id: "u103",
                                        username: "Jane",
                                        fullname: "Jane Doe",
                                        imgUrl: "http://another-cloudinary-image.jpg"
                                    },
                                    style: {
                                        backgroundColor: "done-green"
                                    }
                                }
                            ],
                            style: "dark_indigo"
                        }
                    ],
                    activities: [],
                    priorities: [

                        {
                            id: "p100",
                            title: "Critical",
                            color: "blackish"
                        },
                        {
                            id: "p101",
                            title: "High",
                            color: "dark_indigo"
                        },
                        {
                            id: "p102",
                            title: "Medium",
                            color: "indigo"
                        },
                        {
                            id: "p103",
                            title: "Low",
                            color: "bright-blue"
                        },
                        {
                            id: "p105",
                            title: "",
                            color: "explosive"
                        }

                    ],
                    cmpsOrder: [
                        "side",
                        "title",
                        "members",
                        "status",
                        "priority",
                        "dueDate",
                        "timeline",
                        "files"
                    ]
                },
                {
                    title: "Data Science proj",
                    isStarred: true,
                    archivedAt: 1590010000000,
                    createdBy: {
                        _id: "u104",
                        fullname: "Liam Nelson",
                        imgUrl: "https://cdn1.monday.com/dapulse_default_photo.png"
                    },
                    style: {
                        backgroundImage: ""
                    },
                    labels: [
                        {
                            id: "l100",
                            title: "",
                            color: "explosive"
                        },
                        {
                            id: "l101",
                            title: "Done",
                            color: "done-green"
                        },
                        {
                            id: "l102",
                            title: "Progress",
                            color: "working_orange"
                        },
                        {
                            id: "l103",
                            title: "Stuck",
                            color: "stuck-red"
                        }
                    ],
                    members: [
                        {
                            _id: "u101",
                            fullname: "Gal Ben Natan",
                            imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619973/GalImg_z8ivzb.png"
                        },
                        {
                            _id: "u102",
                            fullname: "Omer Vered",
                            imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619996/OmerImg_svk1xe.png"
                        },
                        {
                            _id: "u103",
                            fullname: "Nati Feldbaum",
                            imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698620005/NatiImg_qvxcqb.png"
                        }
                    ],
                    groups: [
                        {
                            id: "g105",
                            title: "Group X",
                            archivedAt: 1590010000000,
                            tasks: [
                                {
                                    id: "c109",
                                    title: "Analyze Data",
                                    comments: [],
                                    priority: "Low",
                                    status: "Done",
                                    dueDate: undefined,
                                    memberIds: []
                                },
                                {
                                    id: "c110",
                                    title: "Create Visualization",
                                    comments: [],
                                    priority: "Medium",
                                    status: "Progress",
                                    dueDate: undefined,
                                    memberIds: []
                                },
                                {
                                    id: "c111",
                                    title: "Write Report",
                                    comments: [],
                                    priority: "Medium",
                                    status: "Done",
                                    dueDate: undefined,
                                    memberIds: []

                                },
                                {
                                    id: "c112",
                                    title: "Gather Feedback",
                                    comments: [],
                                    priority: "Low",
                                    status: "Stuck",
                                    dueDate: undefined,
                                    memberIds: []
                                }
                            ],
                            style: "dark-orange"
                        },
                        {
                            id: "g106",
                            title: "Group Y",
                            tasks: [
                                {
                                    id: "c113",
                                    title: "Set up Environment",
                                    comments: [],
                                    archivedAt: 1590010000000,
                                    priority: "High",
                                    status: "Stuck",
                                    memberIds: []
                                },
                                {
                                    id: "c114",
                                    title: "Review Code",
                                    status: "Progress",
                                    priority: "Critical",
                                    dueDate: 1615655555555,
                                    memberIds: ["u102"],
                                    description: "Check for bugs",
                                    comments: [
                                        {
                                            id: "LmPqr",
                                            txt: "@emmast please have a look",
                                            createdAt: 1591022222222,
                                            byMember: {
                                                _id: "u105",
                                                fullname: "Emma Stone",
                                                imgUrl: "https://cdn1.monday.com/dapulse_default_photo.png"
                                            }
                                        }
                                    ],
                                    checklists: [
                                        {
                                            id: "WtZrX",
                                            title: "Code Review",
                                            todos: [
                                                {
                                                    id: "414lM",
                                                    title: "Check Functions",
                                                    isDone: false
                                                },
                                                {
                                                    id: "415lN",
                                                    title: "Check Variables",
                                                    isDone: true
                                                }
                                            ]
                                        }
                                    ],
                                    labelIds: ["l105", "l106"],
                                    byMember: {
                                        _id: "u105",
                                        username: "Emma",
                                        fullname: "Emma Stone",
                                        imgUrl: "https://cdn1.monday.com/dapulse_default_photo.png"
                                    },
                                    style: {
                                        backgroundColor: "bright-green"
                                    }
                                }
                            ],
                            style: "bright-green"
                        }
                    ],
                    activities: [],
                    priorities: [

                        {
                            id: "p100",
                            title: "Critical",
                            color: "blackish"
                        },
                        {
                            id: "p101",
                            title: "High",
                            color: "dark_indigo"
                        },
                        {
                            id: "p102",
                            title: "Medium",
                            color: "indigo"
                        },
                        {
                            id: "p103",
                            title: "Low",
                            color: "bright-blue"
                        },
                        {
                            id: "p105",
                            title: "",
                            color: "explosive"
                        }

                    ],
                    cmpsOrder: [
                        "side",
                        "title",
                        "members",
                        "status",
                        "priority",
                        "dueDate",
                        "timeline",
                        "files"
                    ]
                },
                {
                    title: "Web Design project",
                    isStarred: false,
                    archivedAt: 1590500000000,
                    createdBy: {
                        _id: "u106",
                        fullname: "Lucy Williams",
                        imgUrl: "https://cdn1.monday.com/dapulse_default_photo.png"
                    },
                    style: {
                        backgroundImage: ""
                    },
                    labels: [
                        {
                            id: "l100",
                            title: "",
                            color: "explosive"
                        },
                        {
                            id: "l101",
                            title: "Done",
                            color: "done-green"
                        },
                        {
                            id: "l102",
                            title: "Progress",
                            color: "working_orange"
                        },
                        {
                            id: "l103",
                            title: "Stuck",
                            color: "stuck-red"
                        }
                    ],
                    members: [
                        {
                            _id: "u101",
                            fullname: "Gal Ben Natan",
                            imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619973/GalImg_z8ivzb.png"
                        },
                        {
                            _id: "u102",
                            fullname: "Omer Vered",
                            imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619996/OmerImg_svk1xe.png"
                        },
                        {
                            _id: "u103",
                            fullname: "Nati Feldbaum",
                            imgUrl: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698620005/NatiImg_qvxcqb.png"
                        }
                    ],
                    groups: [
                        {
                            id: "g107",
                            title: "Frontend Tasks",
                            archivedAt: 1590500000000,
                            tasks: [
                                {
                                    id: "c115",
                                    title: "Design Landing Page",
                                    comments: [],
                                    priority: "Medium",
                                    status: "Done",
                                    dueDate: 1697576400000,
                                    memberIds: ['u101', 'u102'],
                                    files: [{ url: "http://res.cloudinary.com/dhq4tdw9m/image/upload/v1698836838/mm61elni6avlhzygxkvk.jpg", id: 1698836839367 }]
                                },
                                {
                                    id: "c116",
                                    title: "Create Navigation",
                                    comments: [],
                                    priority: "Low",
                                    status: "Stuck",
                                    timeline: { from: 1696798800000, to: 1700949600000 },
                                    memberIds: []
                                },
                                {
                                    id: "c117",
                                    title: "Implement Animations",
                                    comments: [],
                                    priority: "Low",
                                    status: "Progress",
                                    dueDate: 1697403600000,
                                    timeline: { from: 1696798800000, to: 1698616800000 },
                                    memberIds: ['u103']
                                },
                                {
                                    id: "c118",
                                    title: "Optimize for Mobile",
                                    comments: [],
                                    priority: "Medium",
                                    status: "Done",
                                    memberIds: ['u101']
                                }
                            ],
                            style: "stuck-red"
                        },
                        {
                            id: "g108",
                            title: "Backend Tasks",
                            tasks: [
                                {
                                    id: "c119",
                                    title: "Set up Database",
                                    comments: [],
                                    priority: "High",
                                    status: "Stuck",
                                    dueDate: 1697490000000,
                                    timeline: { from: 1697058000000, to: 1697749200000 },
                                    memberIds: []
                                },
                                {
                                    id: "c120",
                                    title: "Create API Endpoints",
                                    status: "Progress",
                                    priority: "Critical",
                                    dueDate: undefined,
                                    memberIds: ["u101"],
                                    files: [{ url: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619879/cld-sample-4.jpg", id: 177736839367 },
                                    { url: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619876/samples/dessert-on-a-plate.jpg", id: 12365123623 }],
                                    description: "Endpoints for CRUD operations",
                                    comments: [
                                        {
                                            id: "RtUvw",
                                            txt: "@mikeb can you test the endpoints?",
                                            createdAt: 1591503333333,
                                            byMember: {
                                                _id: "u107",
                                                fullname: "Mike Brown",
                                                imgUrl: "https://cdn1.monday.com/dapulse_default_photo.png"
                                            }
                                        }
                                    ],
                                    checklists: [
                                        {
                                            id: "XsYtZ",
                                            title: "API Tests",
                                            todos: [
                                                {
                                                    id: "516oO",
                                                    title: "Test GET request",
                                                    isDone: true
                                                },
                                                {
                                                    id: "517pP",
                                                    title: "Test POST request",
                                                    isDone: false
                                                }
                                            ]
                                        }
                                    ],
                                    labelIds: ["l107", "l108"],
                                    byMember: {
                                        _id: "u107",
                                        username: "Mike",
                                        fullname: "Mike Brown",
                                        imgUrl: "https://cdn1.monday.com/dapulse_default_photo.png"
                                    },
                                    style: {
                                        backgroundColor: "done-green"
                                    }
                                }
                            ],
                            style: "dark-blue"
                        }, {
                            id: "g109",
                            title: "UI/UX",
                            tasks: [
                                {
                                    id: "c222",
                                    title: "Design home page",
                                    comments: [],
                                    priority: "Medium",
                                    status: "Done",
                                    dueDate: 1696366800000,
                                    timeline: { from: 1696280400000, to: 1697490000000 },
                                    files: [{ url: "https://res.cloudinary.com/ddcaqfqvh/image/upload/v1698619871/samples/balloons.jpg", id: 177736839367 }],
                                    memberIds: ['u101', 'u102']
                                },
                                {
                                    id: "c223",
                                    title: "Pixel perfect buttons",
                                    comments: [],
                                    priority: "Low",
                                    status: "Stuck",
                                    memberIds: []
                                },
                                {
                                    id: "c224",
                                    title: "Color pallet",
                                    comments: [],
                                    priority: "Critical",
                                    status: "Done",
                                    dueDate: 1996366800000,
                                    timeline: { from: 1698094800000, to: 1699221600000 },
                                    memberIds: ['u103']
                                },
                                {
                                    id: "c2652",
                                    title: "Use rems and ems",
                                    comments: [],
                                    priority: "Medium",
                                    status: "Progress",
                                    timeline: { from: 1699221600000, to: 1700604000000 },
                                    memberIds: []
                                }
                            ],
                            style: 'lipstick'
                        },
                    ],
                    activities: [],
                    priorities: [
                        {
                            id: "p100",
                            title: "Critical",
                            color: "blackish"
                        },
                        {
                            id: "p101",
                            title: "High",
                            color: "dark_indigo"
                        },
                        {
                            id: "p102",
                            title: "Medium",
                            color: "indigo"
                        },
                        {
                            id: "p103",
                            title: "Low",
                            color: "bright-blue"
                        },
                        {
                            id: "p105",
                            title: "",
                            color: "explosive"
                        }

                    ],
                    cmpsOrder: [
                        "side",
                        "title",
                        "members",
                        "status",
                        "priority",
                        "dueDate",
                        "timeline",
                        "files"
                    ]
                }
            ]

        boards.forEach(board => httpService.post(BASE_URL, board))
        // utilService.saveToStorage(STORAGE_KEY, boards)
    }
}