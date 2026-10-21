import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';
import auth from '../store/authSlice';
import { request } from '../lib/api';
jest.mock('../lib/api',()=>({request:jest.fn(),api:{auth:{signOut:jest.fn()}}}));
function setup(role) {
 const user={id:'1',email:'buyer@example.com',name:'Buyer',role};
 const store=configureStore({reducer:{auth},preloadedState:{auth:{user,isAuthenticated:true}}});
 render(<Provider store={store}><MemoryRouter><Profile/></MemoryRouter></Provider>);return store;
}
test('customer sees own profile but no dashboard or editable role',()=>{
 setup('customer');expect(screen.getByText('buyer@example.com')).toBeInTheDocument();
 expect(screen.queryByRole('link',{name:'Open dashboard'})).not.toBeInTheDocument();expect(screen.getAllByRole('textbox')).toHaveLength(1);
});
test('administrator sees the dashboard link',()=>{setup('admin');expect(screen.getByRole('link',{name:'Open dashboard'})).toHaveAttribute('href','/admin/');});
test('saving sends only name and updates current account',async()=>{
 const store=setup('customer');request.mockResolvedValueOnce({user:{id:'1',email:'buyer@example.com',name:'New name',role:'customer'}});
 fireEvent.change(screen.getByLabelText('Name'),{target:{value:'New name'}});fireEvent.click(screen.getByRole('button',{name:'Save details'}));
 await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('saved'));
 expect(JSON.parse(request.mock.calls[0][1].body)).toEqual({name:'New name'});expect(store.getState().auth.user.role).toBe('customer');
});
