import {
	Button,
	InputAdornment,
	TextField,
	Typography
} from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Prompt, Redirect } from 'react-router-dom';
import '../css/draft.css';
import {
	apiGetCB,
	getEditorRaw,
	getEditorState,
	getError,
	loadingComponent,
	redirect,
	res200,
	widerFieldStyle
} from '../Utils';

const EditSchool = props => {
	const [value, setValue] = React.useState({
		loading: false,
		error: false
	});
	const [error, setError] = React.useState(false);
	const [user, setUser] = React.useState(null);
	const [school, setSchool] = React.useState(null);
	React.useEffect(
		apiGetCB(
			'/api/getschool/' + props.match.params.link,
			async (err, school) => {
				try {
					if (err) throw err;
					const res = await Axios.get('/api/me');
					setUser(res.data);
					if (school.userId !== res.data._id)
						throw new Error('No permission!');
					setSchool(school);
					setValue({
						...value,
						name: school.name,
						link: school.link,
						summary: school.summary,
						editorState: getEditorState(school.content)
					});
				} catch (err) {
					return setError(err);
				}
			}
		),
		[]
	);
	const loading = loadingComponent(user, error);
	if (loading) return loading;
	if (!user)
		return (
			<Redirect
				to={'/login?redirect=' + window.location.pathname.slice(1)}
			/>
		);
	return (
		<>
			<Prompt message="Pekerjaan Anda tidak akan tersimpan jika Anda meninggalkan halaman ini!" />
			<Typography variant="h5">Edit konten sekolah</Typography>
			<TextField
				error={!!value.error}
				label="Nama Sekolah"
				style={widerFieldStyle(2.5)}
				value={value.name || ''}
				onChange={e => setValue({ ...value, name: e.target.value })}
				margin="normal"
				variant="outlined"
			/>
			<br />
			<TextField
				error={!!value.error}
				label="URL Halaman"
				style={widerFieldStyle(2.5)}
				value={value.link || ''}
				onChange={e => setValue({ ...value, link: e.target.value })}
				margin="normal"
				variant="outlined"
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							/school/
						</InputAdornment>
					)
				}}
			/>
			<br />
			<TextField
				label="Thumbnail Image Link (optional) (resized to: 200x150)"
				style={widerFieldStyle(2.5)}
				value={value.thumbnail || ''}
				onChange={e =>
					setValue({ ...value, thumbnail: e.target.value })
				}
				margin="normal"
				variant="outlined"
			/>
			<br />
			<TextField
				label="Deskripsi Pendek"
				value={value.summary || ''}
				multiline
				rows="4"
				style={widerFieldStyle(2.5)}
				onChange={e => setValue({ ...value, summary: e.target.value })}
				margin="normal"
				variant="outlined"
			/>
			<br />
			<Typography variant="h6">Konten:</Typography>
			<Editor
				editorState={value.editorState}
				onEditorStateChange={editorState =>
					setValue({ ...value, editorState })
				}
				toolbarClassName="toolbar"
				wrapperClassName="wrapper"
				editorClassName="editor"
				toolbar={{
					fontFamily: {
						options: [
							'Arial',
							'Georgia',
							'Impact',
							'Roboto',
							'Tahoma',
							'Times New Roman',
							'Verdana'
						]
					}
				}}
			/>
			<br />
			{value.error ? (
				<>
					<Typography style={{ color: 'red' }}>
						{value.error}
					</Typography>
					<br />
				</>
			) : null}
			<Button
				variant="contained"
				color="primary"
				onClick={() => {
					setValue({ ...value, loading: true });
					(async () => {
						try {
							const res = await Axios.post(
								'/api/editschool/' + school.link,
								{
									name: value.name,
									link: value.link,
									thumbnail: value.thumbnail,
									summary: value.summary,
									content: getEditorRaw(value.editorState)
								}
							);
							if (res200(res)) redirect('school/' + value.link);
						} catch (err) {
							setValue({
								...value,
								loading: false,
								error: getError(err)
							});
						}
					})();
				}}
				disabled={value.loading}
			>
				{value.loading ? 'Uploading data...' : 'Ubah Konten'}
			</Button>
		</>
	);
};

export default EditSchool;
