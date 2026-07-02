import { supabase } from '../config/supabase.js';

// Cari user berdasarkan email
export const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*, profiles(*)')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Cari user berdasarkan ID
export const findUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*, profiles(*)')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Buat user baru
export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Buat profile baru
export const createProfile = async (profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profileData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update user
export const updateUser = async (id, userData) => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};