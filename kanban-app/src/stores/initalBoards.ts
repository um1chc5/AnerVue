import type { BoardType } from 'src/types/board'

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

export const initialSingleBoard: BoardType = {
  board_id: '8eeb085a-4789-444a-be72-135f030de124',
  board_name: 'New board 3',
  data: [
    {
      col_id: 'col#1ca63fd7-7dbc-47cf-b224-cb8df16c2f49',
      col_name: 'To do',
      tasks: [
        {
          task_id: 'task#1ca63fd7-7dbc-47cf-b224-cb8df16c2f49#5af3cb51-4d51-4bd4-8692-262f192b9d53',
          title: 'Option API',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
          subtasks: [
            {
              title: 'subtask 1',
              done: false,
              id: 1
            },
            {
              title: 'subtask 2',
              done: true,
              id: 2
            },
            {
              title: 'subtask 3',
              done: false,
              id: 3
            }
          ]
        },
        {
          task_id: 'task#1ca63fd7-7dbc-47cf-b224-cb8df16c2f49#735519cb-716e-4224-a0dc-b03cfbe5cbb3',
          title: 'Composition API',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
          subtasks: [
            {
              title: 'subtask 1',
              done: false,
              id: 1
            },
            {
              title: 'subtask 2',
              done: true,
              id: 2
            },
            {
              title: 'subtask 3',
              done: false,
              id: 3
            }
          ]
        }
      ]
    },
    {
      col_id: 'col#67e0c4d5-52e0-47f1-bb32-c5b52d93d439',
      col_name: 'In progress',
      tasks: [
        {
          task_id: 'task#67e0c4d5-52e0-47f1-bb32-c5b52d93d439#b1310cf4-3c69-499d-b3ad-e8b2afb81280',
          title: 'Pinia',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
          subtasks: [
            {
              title: 'subtask 1',
              done: false,
              id: 1
            },
            {
              title: 'subtask 2',
              done: true,
              id: 2
            },
            {
              title: 'subtask 3',
              done: false,
              id: 3
            }
          ]
        },
        {
          task_id: 'task#67e0c4d5-52e0-47f1-bb32-c5b52d93d439#cbee40ff-e564-4ed6-a526-0e456f44e337',
          title: 'Vue Router',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt utlabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
          subtasks: [
            {
              title: 'subtask 1',
              done: false,
              id: 1
            },
            {
              title: 'subtask 2',
              done: true,
              id: 2
            },
            {
              title: 'subtask 3',
              done: false,
              id: 3
            }
          ]
        }
      ]
    },
    {
      col_id: 'col#ce8f0d71-ac87-4b75-8110-c7cdee926dad',
      col_name: 'Complete',
      tasks: []
    }
  ]
}
