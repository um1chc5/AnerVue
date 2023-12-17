export const initalBoards = [
  {
    board_name: 'Vue learning plan',
    path: 'vue-learning-plan',
    data: [
      {
        col_name: 'Todo',
        tasks: [
          {
            id: 1,
            title: 'Composition API',
            description:
              ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
            subtasks: [
              { id: 1, title: 'subtask 1', done: false },
              { id: 2, title: 'subtask 2', done: true },
              { id: 3, title: 'subtask 3', done: false }
            ]
          },
          {
            id: 2,
            title: 'Option API',
            description:
              ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
            subtasks: [
              { id: 1, title: 'subtask 1', done: false },
              { id: 2, title: 'subtask 2', done: true },
              { id: 3, title: 'subtask 3', done: false }
            ]
          }
        ]
      },
      {
        col_name: 'Doing',
        tasks: [
          {
            id: 1,
            title: 'Router',
            subtasks: [
              { id: 1, title: 'subtask 1', done: true },
              { id: 2, title: 'subtask 2', done: false }
            ]
          },
          {
            id: 2,
            title: 'State Management',
            description:
              ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
            subtasks: [
              { id: 1, title: 'subtask 1', done: false },
              { id: 2, title: 'subtask 2', done: true },
              { id: 3, title: 'subtask 3', done: false }
            ]
          }
        ]
      },
      {
        col_name: 'Done',
        tasks: [
          {
            id: 1,
            title: 'Ref and Reactive',
            subtasks: [
              { id: 1, title: 'subtask 1', done: false },
              { id: 2, title: 'subtask 2', done: true }
            ]
          },
          {
            id: 2,
            title: 'Data binding in Vue',
            description:
              ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
            subtasks: [
              { id: 1, title: 'subtask 1', done: false },
              { id: 2, title: 'subtask 2', done: true }
            ]
          }
        ]
      }
    ]
  },
  {
    board_name: 'Fsoft intern plan',
    path: 'fsoft-intern-plan',
    data: [
      { col_name: 'Todo', tasks: [] },
      { col_name: 'Doing', tasks: [] },
      { col_name: 'Done', tasks: [] }
    ]
  }
]
