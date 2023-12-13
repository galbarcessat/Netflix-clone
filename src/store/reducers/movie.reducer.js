// export const SET_IS_LOADING = 'SET_IS_LOADING'
export const SET_SELECTED_MOVIE = 'SET_SELECTED_MOVIE'

const initialState = {
    selectedMovie: null,
    // isLoading: false
}

export function movieReducer(state = initialState, action) {
    // let newBoards
    switch (action.type) {
        case SET_SELECTED_MOVIE:
            return { ...state, selectedMovie: action.selectedMovie }
        // case SET_IS_LOADING:
        //     return { ...state, isLoading: action.isLoading }
        default:
            return { ...state }

    }
}
