import { MessageWindowStatus, useSupabase } from '@/pages/supabaseProvider';
import styles from './new_message.module.css';
import { useEffect, useState } from 'react';
import User from '@/lib/users/user';
import ProfilePicture from '@/components/misc/profile-picture';

type NewMessageProps = {
    user: User
}

export const NewMessage = ({ user }: NewMessageProps) => {

    const { status, supabase, setStatus } = useSupabase();

    // the search inputvalue
    const [search, setSearch] = useState('');
    // the message input valur
    const [message, setMessage] = useState('');
    // to display in the search input
    const [userFounds, setUserFounds] = useState<User[]>([]);
    // the person to send the message to
    const [receiver, setReceiver] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers('');
    }, [status]);

    const fetchUsers = async (search: string) => {
        // if string is empty, clear the list
        setSearch(search);
        if (search == '') {
            setUserFounds([]);
            return;
        }

        // fetch 5 first users from the database
        const { data, error } = await supabase.from('profiles').select('*').ilike('first_name', `%${search}%`).limit(5);
        if (error) {
            console.log('error1');
            alert(error.message);
            return;
        }
        if (data) {
            let users = data.map((userMap: any) => new User(userMap.id, userMap.first_name, userMap.last_name)); // eslint-disable-line @typescript-eslint/no-explicit-any
            // remove the current user from the list
            users = users.filter((u) => u.getId() !== user.getId());

            setUserFounds(users);
        }
    };


    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        fetchUsers(e.target.value);
    }

    const handleSelectReceiver = (user: User) => {
        // first set the reciever hook
        setReceiver(user);
        // then reset the search input
        setUserFounds([]);
        setSearch('');
    }

    const sendMessage = async () => {
        // get the message
        if (!receiver) {
            alert('Veuillez sélectionner un destinataire');
            return;
        }
        if (message == '') {
            alert('Veuillez saisir un message');
            return;
        }

        const { error } = await supabase.from('messages').insert([
            {
                receiver: receiver.getId(),
                sender: user.getId(),
                message: message,
                read: false
            }
        ]);
        if (error) {
            console.log('error6');
            alert(error.message);
            return;
        }
        // go to the conversations
        setStatus(MessageWindowStatus.NO_ACTION);

    }

    const handleGoback = () => {
        setStatus(MessageWindowStatus.NO_ACTION);
    }

    return (
        <div className={styles.newMessage}>
            <div className='goBack' onClick={handleGoback}><span className="material-symbols-outlined">arrow_back_ios</span></div>
            <h1>Nouveau message</h1>
            <div className={styles.inputSearch} >
                <input
                    type='search'
                    name='search'
                    value={search}
                    placeholder='Nom ou numéro de téléphone'
                    onChange={handleSearchInput}
                    autoFocus
                />
                {userFounds.length > 0 && (<div className={styles.searchResults}>
                    {userFounds.map((user) => (
                        <div key={user.getId()} className={styles.searchResult} onClick={() => handleSelectReceiver(user)}>
                            <div className='darkSensibleText'>{user.getFullName()}</div>
                        </div>
                    ))}
                </div>
                )}
            </div>
            <div className='hSep' />
            {receiver && (
                <div className={styles.receiver}>
                    <div className={styles.profile}>
                        <ProfilePicture initials={receiver.getInitials()} />
                        {receiver.getFullName()}
                    </div>
                    <fieldset role="group">
                        <input
                            name="text"
                            type="text"
                            placeholder="Saisir un message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage();
                                }
                            }}
                        />
                        <input type="submit" value="Envoyer" onClick={sendMessage} />
                    </fieldset>
                </div>
            )}
        </div>)
};

export default NewMessage;