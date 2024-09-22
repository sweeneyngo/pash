import { useState } from 'react'
import { getData } from './utils/parse';
import { Credential, Credentials } from './utils/types';
import './App.css'


interface PassCredential {
  id: string,
  name: string,
  username: string | null
};

function App() {

  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [passwords, setPasswords] = useState<Map<string, PassCredential[]>>();
  const [isMasked, setMasked] = useState(true);
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    if (!event.target.files) return;

    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      setError('Please upload a valid JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (!e.target || !e.target.result) return;
        const data: Credentials = getData(JSON.parse(e.target.result.toString()));
        const credentials = data.items;
        setPasswords(createPasswordMap(credentials));
        setCredentials(credentials);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to parse file. Check for correct BitWarden export.');
      }
    };

    reader.onerror = () => {
      setError('Error reading file.');
    };

    reader.readAsText(file);
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    // Format the date and time
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); // Last two digits of the year
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}/${day}/${year} (${hours}:${minutes}:${seconds})`;
  }

  function createPasswordMap(credentials: Credential[]) {
    const passwordMap = new Map<string, PassCredential[]>();

    credentials.forEach(({ id, name, username, password }) => {
      if (password) {
        if (!passwordMap.has(password)) {
          passwordMap.set(password, []);
        }
        const passCredentials = passwordMap.get(password) || [];
        passCredentials.push({ id, name, username });
        passwordMap.set(password, passCredentials);
      }
    });

    console.log(passwordMap);
    return passwordMap;
  }

  function sortName() {
    const newCredentials = [...credentials].sort((a, b) => {
      // Handle null values
      if (a.name === null && b.name === null) return 0; // Both are null, keep order
      if (a.name === null) return 1; // Treat null as greater than any string
      if (b.name === null) return -1; // Treat any string as greater than null

      return a.name.localeCompare(b.name);
    });

    setCredentials(newCredentials);
  }

  function sortUsername() {
    const newCredentials = [...credentials].sort((a, b) => {
      // Handle null values
      if (a.username === null && b.username === null) return 0; // Both are null, keep order
      if (a.username === null) return 1; // Treat null as greater than any string
      if (b.username === null) return -1; // Treat any string as greater than null

      return a.username.localeCompare(b.username);
    });

    setCredentials(newCredentials);
  }

  function sortPassword() {
    const newCredentials = [...credentials].sort((a, b) => {
      // Handle null values
      if (a.password === null && b.password === null) return 0; // Both are null, keep order
      if (a.password === null) return 1; // Treat null as greater than any string
      if (b.password === null) return -1; // Treat any string as greater than null

      // Use localeCompare for non-null passwords
      return a.password.localeCompare(b.password);
    });

    setCredentials(newCredentials);
  }

  function sortCommonPasswords() {

    if (!passwords) return null;

    for (const [key, value] of passwords) {
      if (value.length > 1) {
        console.log(key, value);
      }
    }

    const nonUniquePasswords = new Set(Array.from(passwords)
      .filter(([, value]) => value.length > 1) // Filter by length
      .map(([key]) => key));

    const newCredentials = [...credentials].sort((a, b) => {
      const aIsNonUnique = a.password !== null && nonUniquePasswords.has(a.password);
      const bIsNonUnique = b.password !== null && nonUniquePasswords.has(b.password);
      if (aIsNonUnique && !bIsNonUnique) return -1; // a comes first
      if (!aIsNonUnique && bIsNonUnique) return 1;  // b comes first
      return (a.password || '').localeCompare(b.password || ''); // Sort alphabetically if both are unique or non-unique
    });

    return setCredentials(newCredentials);
  }

  function sortLastUpdated() {
    const newCredentials = [...credentials].sort((a, b) => {
      // Convert revisionDate strings to Date objects for comparison
      return new Date(b.revisionDate).getTime() - new Date(a.revisionDate).getTime();
    });
    setCredentials(newCredentials);
  }

  function reverse() {
    const newCredentials = [...credentials].reverse();
    setCredentials(newCredentials);
  }

  return (
    <div className='panel'>
      <div className='list'>
        {credentials.map(({ id, name, username, password, revisionDate }) => (
          <div key={id} className='block'>
            <div className='flex-v'>
              <h6>{name}</h6>
              <p>{username}</p>
              <p>{isMasked ? "■■■■■■" : password}</p>
              <p className='gray-text'>Last updated: {formatDate(revisionDate)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='diagnostic'>
        <div className='flex-v left'>
          <p>{credentials.length} loaded.</p>
          <label className="file-upload-label">
            <input
              type="file"
              accept=".json"
              className="file-upload-input"
              onChange={(e) => handleFileChange(e)}
            />
            <p>upload file</p>
          </label>
          <button onClick={() => setMasked(!isMasked)}>mask/unmask</button>
          <button onClick={() => sortName()}>sort by name</button>
          <button onClick={() => sortUsername()}>sort by username</button>
          <button onClick={() => sortPassword()}>sort by password</button>
          <button onClick={() => sortLastUpdated()}>sort by last updated</button>
          <button onClick={() => reverse()}>sort in reverse</button>
          <button onClick={() => sortCommonPasswords()}>check common passwords</button>
        </div>
      </div>
      <div className={`notification ${error && 'show'}`}>
        <p>{error}</p>
      </div>
    </div>
  )
}

export default App
