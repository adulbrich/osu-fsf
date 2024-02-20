import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SBTeam } from '../lib/supabase-types';
import { supabase } from '../lib/supabase';

export interface TeamsState {
  teams: SBTeam[]
}

const initialState: TeamsState = {
  teams: []
}

export const fetchTeams = createAsyncThunk<
  SBTeam[],
  undefined,
  { rejectValue: string }
>('events/fetchTeams', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('Teams')
    .select('*')
  if (error) return rejectWithValue(error.message);
  return data ?? [];
});

export const createTeam = createAsyncThunk<
  SBTeam,
  { name: string, eventID: string },
  { rejectValue: string }
>('events/createTeam', async ({ name, eventID }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('Teams')
    .insert({
      Name: name,
      BelongsToEventID: eventID
    })
    .select()
    .single();
  if (error) return rejectWithValue(error.message);
  return data;
});

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchTeams.fulfilled, (state, action) => {
      return { ...state, teams: action.payload }
    })
  }
});

export default teamsSlice.reducer;