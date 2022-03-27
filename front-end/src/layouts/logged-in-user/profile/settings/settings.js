import {
    Box,
    Center,
    Text,
    Stack,
    Button,
    Image,
    Input,
    Flex,
    Avatar,
    IconButton,
} from '@chakra-ui/react';
import axios from 'axios';

import React, { useEffect, useState } from 'react'
import ProfilePicture from "@dsalvagni/react-profile-picture"
import "@dsalvagni/react-profile-picture/dist/ProfilePicture.css"
import { ArrowLeftIcon } from '@chakra-ui/icons';

export default function Settings({ user, label, section }) {

    const [settingScreen, setSettingScreen] = useState(section)
    console.log(section);


    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState('')




    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [editName, setEditName] = useState(false);
    const [currentName, setCurrentName] = useState(user.firstName + ' ' + user.lastName);
    const [usernameMessage, setUsernameMessage] = useState('');
    const [usernameError, setUsernameError] = useState(false);


    const [editEmail, setEditEmail] = useState(false);
    const [closeBoxMessage, setCloseBoxMessage] = useState('Close');

    const [editPassword, setEditPassword] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');

    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');


    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setOldPasswordError('');
        setNewPasswordError('');
        setConfirmNewPasswordError('');
        setFirstName(user.firstName);
        setLastName(user.lastName);

    }, [editPassword])

    let pictureRef = React.createRef();

    function handleProfilePic() {
        const PP = pictureRef.current;
        const imageData = PP.getData();
        const file = imageData.file;
        const imageAsDataUrl = PP.getImageAsDataUrl();
        const data = new FormData();
        console.log("PP", PP);
        console.log("imageData", imageData);
        console.log("File", file);
        console.log("URL", imageAsDataUrl);


        var url = imageAsDataUrl;
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                data.append('image', blob, 'filename')
                console.log(blob)
            })

        axios.post("http://localhost:5000/api/updateProfileImage", data).then((response) => {
            console.log(response);
        })
    }

    function dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    }

    if (settingScreen === 'profilePic') {
        return (
            <>
                <Box>
                    <Stack direction={'column'}>
                        <Center>
                            <Text fontSize={'1.25vw'} color={'var(--text-color)'}>
                                Edit Profile Picture
                            </Text>
                        </Center>
                        <Center>
                            <ProfilePicture
                                ref={pictureRef}
                                frameFormat={'circle'}
                            />
                        </Center>
                        <Box bg='red'>
                            <Button position={'absolute'} right={5} bottom={3}
                                onClick={handleProfilePic}
                            >
                                Upload
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </>
        )
    }
    if (settingScreen === 'profile') {
        return (
            <Box>
                <Stack direction={'column'}>
                    <Center>
                        <Text fontSize={'1.25vw'} color={'var(--text-color)'}>
                            Settings
                        </Text>
                    </Center>
                    <Box pt={'5vh'}>
                        <Center>
                            <Box>
                                <Avatar
                                    name={user.firstName + ' ' + user.lastName}
                                    borderRadius={'full'}
                                    src={user.profilePic}
                                    boxSize='4vw'
                                />


                            </Box>
                            <Box pb={'1vh'} pl={'.5vw'}>
                                <Text fontSize={'lg'} fontWeight={'bold'} color={"var(--text-color)"}>
                                    {currentName}
                                </Text>
                                <Text pl={'1'} fontSize={'sm'} color={"var(--text-color)"}>
                                    @{user.username}
                                </Text>
                            </Box>
                        </Center>
                    </Box>

                    <Center>
                        <Stack p={'2vh'} direction={'column'}>
                            <Box borderRadius={'10'} background={'var(--settings-background-color)'} width={'auto'} pt={'.3vw'}>
                                <Box p={'.75vw'} pr={'2vw'}>
                                    <Stack direction={'column'}>
                                        <Box pr={'2.3vw'}>
                                            <Text fontWeight={'semibold'} fontSize={'lg'} color={"var(--settings-head-color)"}>
                                                Display Name
                                            </Text>
                                            <Stack direction={'row'}>
                                                <Center>
                                                    <Flex>
                                                        <Stack
                                                            style={{
                                                                flex: "0 0 50%",
                                                                display: "flex",
                                                                justifyContent: "flex-start",

                                                            }}
                                                            direction={'column'}
                                                        >
                                                            {editName ?
                                                                <Box width={'11.5vw'} pt={'.3vh'} pl={'.1vw'}>
                                                                    <Input height={'3.25vh'} fontSize={'md'} color={"var(--text-color)"}
                                                                        value={currentName}
                                                                        onChange={(e) => {
                                                                            setCurrentName(e.target.value)
                                                                        }}
                                                                    >
                                                                    </Input>
                                                                </Box>
                                                                :
                                                                <Box width={'14vw'} pt={'.3vh'} pl={'.1vw'}>
                                                                    <Text fontSize={'md'} color={"var(--text-color)"}>
                                                                        {currentName}
                                                                    </Text>
                                                                </Box>
                                                            }
                                                            <Box width={'14vw'}>
                                                                {
                                                                    (usernameMessage != '') ?
                                                                        <Text color={usernameError ? 'red' : 'green'} fontSize={'md'}>
                                                                            {usernameMessage}
                                                                        </Text>
                                                                        :
                                                                        null

                                                                }
                                                            </Box>
                                                        </Stack>
                                                        <div
                                                            style={{
                                                                flex: "0 0 40%",
                                                                display: "flex",
                                                                justifyContent: "flex-end",

                                                            }}
                                                        >
                                                            <Box >
                                                                <Button width={'auto'} height={'auto'} bg={'white'}
                                                                    onClick={() => {
                                                                        if (editName) {
                                                                            user.firstName = currentName.split(' ')[0]
                                                                            user.lastName = currentName.split(' ')[1]
                                                                            console.log(user);
                                                                            if (user.firstName != undefined && user.lastName != undefined && user.firstName != '' && user.lastName != '' && user.firstName.length > 0 && user.lastName.length > 0) {
                                                                                setEditName(false)
                                                                                axios.defaults.headers.common['authorization'] = localStorage.getItem('token')
                                                                                console.log(currentName)
                                                                                console.log(currentName.split(' ')[0]);
                                                                                console.log(currentName.split(' ')[1]);

                                                                                try {
                                                                                    axios.put("http://localhost:5000/api/updateProfile", {
                                                                                        firstName: currentName.split(' ')[0],
                                                                                        lastName: currentName.split(' ')[1],
                                                                                    })
                                                                                        .then(res => {
                                                                                            console.log(res);
                                                                                            setEditName(false);
                                                                                            if (firstName != currentName.split(' ')[0] || lastName != currentName.split(' ')[1]) {
                                                                                                setUsernameMessage('Name updated successfully');
                                                                                            }


                                                                                            setTimeout(() => setUsernameMessage(''), 3000);
                                                                                            setUsernameError(false);
                                                                                        })
                                                                                    console.log('updated')
                                                                                } catch (error) {
                                                                                    console.log(error);
                                                                                }
                                                                            } else {
                                                                                setUsernameError(true);
                                                                                setUsernameMessage('Please enter a valid first and last name');
                                                                            }
                                                                        } else {
                                                                            setEditName(true);
                                                                        }
                                                                    }}
                                                                >
                                                                    <Text pl={'1px'} pr={'1px'} pt={'4px'} pb={'4px'} fontSize={'sm'}>
                                                                        {editName ? firstName != currentName.split(' ')[0] || lastName != currentName.split(' ')[1] ? 'Save' : 'Cancel' : 'Edit'}
                                                                    </Text>
                                                                </Button>
                                                            </Box>
                                                        </div>
                                                    </Flex>
                                                </Center>
                                            </Stack>
                                        </Box>
                                        <Box>
                                            <Text fontWeight={'semibold'} fontSize={'lg'} color={"var(--settings-head-color)"}>
                                                Email
                                            </Text>
                                            <Stack direction={'row'}>
                                                <Flex>
                                                    <div
                                                        style={{
                                                            flex: "0 0 50%",
                                                            display: "flex",
                                                            justifyContent: "flex-start",

                                                        }}
                                                    >
                                                        {editEmail ?
                                                            <Box width={'11.5vw'} pt={'.3vh'} pl={'.1vw'}>
                                                                <Input height={'3.25vh'} fontSize={'md'} color={"var(--text-color)"}
                                                                    value={user.email}
                                                                >
                                                                </Input>
                                                            </Box>
                                                            :
                                                            <Box width={'11.5vw'} pt={'.3vh'} pl={'.1vw'}>
                                                                <Text fontSize={'md'} color={"var(--text-color)"}>
                                                                    {user.email}
                                                                </Text>
                                                            </Box>
                                                        }
                                                    </div>
                                                    {/* <div
                                                        style={{
                                                            flex: "0 0 45%",
                                                            display: "flex",
                                                            justifyContent: "flex-end",

                                                        }}
                                                    >
                                                        <Box >
                                                            <Button minW={'12'} minH={'4'} width={'2vw'} height={'2vh'} bg={'white'}
                                                                onClick={() => {
                                                                    setEditEmail(!editEmail);
                                                                }}
                                                            >
                                                                <Text fontSize={'.55vw'}>
                                                                    {editEmail ? 'Save' : 'Edit'}
                                                                </Text>
                                                            </Button>
                                                        </Box>
                                                    </div> */}
                                                </Flex>
                                            </Stack>
                                        </Box>
                                        <Box>
                                            <Text fontWeight={'semibold'} fontSize={'lg'} color={"var(--settings-head-color)"}>
                                                Password
                                            </Text>
                                            <Stack direction={'row'}>
                                                <Flex>
                                                    <div
                                                        style={{
                                                            flex: "0 0 50%",
                                                            display: "flex",
                                                            justifyContent: "flex-start",

                                                        }}
                                                    >
                                                        <Box width={'11.2vw'} pt={'.3vh'} pl={'.1vw'}>
                                                            <Text fontSize={'md'} color={"var(--text-color)"}>
                                                                {"**********"}
                                                            </Text>
                                                        </Box>
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 61%",
                                                            display: "flex",
                                                            justifyContent: "flex-end",

                                                        }}
                                                    >
                                                        <Box >
                                                            <Button width={'auto'} height={'auto'} bg={'white'}
                                                                onClick={() => {
                                                                    setEditPassword(!editPassword);
                                                                    setSettingScreen("password");
                                                                }}
                                                            >
                                                                <Text pl={'1px'} pr={'1px'} pt={'4px'} pb={'4px'} fontSize={'sm'}>
                                                                    Change
                                                                </Text>
                                                            </Button>
                                                        </Box>
                                                    </div>
                                                </Flex>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                            <Box borderRadius={'10'} background={'var(--settings-background-color)'} width={'auto'} pt={'.3vw'}>
                                <Box p={'.75vw'}>
                                    <Stack direction={'column'}>
                                        <Box pr={'2.3vw'}>
                                            <Text fontWeight={'semibold'} fontSize={'lg'} color={"var(--settings-head-color)"}>
                                                Delete Account
                                            </Text>
                                            <Stack direction={'row'}>
                                                <Flex>
                                                    <div
                                                        style={{
                                                            flex: "0 0 50%",
                                                            display: "flex",
                                                            justifyContent: "flex-start",

                                                        }}
                                                    >
                                                        <Box width={'11.5vw'} pt={'.3vh'} pl={'.1vw'}>
                                                            <Text fontSize={'md'} color={"var(--text-color)"}>
                                                                Permanently delete your account
                                                            </Text>
                                                        </Box>
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 61%",
                                                            display: "flex",
                                                            justifyContent: "flex-end",

                                                        }}
                                                    >
                                                        <Box >
                                                            <Button width={'auto'} height={'auto'} backgroundColor={'red'} color={'white'}
                                                                onClick={() => {
                                                                    try {
                                                                        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
                                                                        axios.get("http://localhost:5000/api/deleteProfile/").then((res) => {
                                                                            localStorage.removeItem('token');
                                                                            let url = window.location.href;
                                                                            window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";
                                                                        });

                                                                    } catch (error) {
                                                                        console.log(error);

                                                                    }
                                                                }}
                                                            >
                                                                <Text pl={'1px'} pr={'1px'} pt={'4px'} pb={'4px'} fontSize={'sm'}>
                                                                    Delete
                                                                </Text>
                                                            </Button>
                                                        </Box>
                                                    </div>
                                                </Flex>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        </Stack >
                    </Center >
                </Stack >
            </Box >
        )
    } else if (settingScreen === 'password') {
        return (
            <>
                <Box>
                    <Stack direction={'column'}>
                        <Center>
                            <Text fontSize={'30'} color={'var(--text-color)'}>
                                Change Password
                            </Text>
                        </Center>
                        <Box pt={'5vh'}>
                            <Center>
                                <Box>
                                    <Avatar
                                        name={user.firstName + ' ' + user.lastName}
                                        borderRadius={'full'}
                                        src={user.profilePic}
                                        boxSize='4vw'
                                    />
                                </Box>
                                <Box pb={'1vh'} pl={'.5vw'}>
                                    <Text fontSize={'20'} fontWeight={'bold'} color={"var(--text-color)"}>
                                        {user.firstName} {user.lastName}
                                    </Text>
                                    <Text pl={'1'} fontSize={'13'} color={"var(--text-color)"}>
                                        @{user.username}
                                    </Text>
                                </Box>
                            </Center>
                        </Box>

                        <Center>
                            <Stack p={'2vh'} direction={'column'}>
                                <Box borderRadius={'10'} background={'var(--settings-background-color)'} width={'auto'} pt={'.3vw'}>
                                    <Box p={'.75vw'}>
                                        <Stack direction={'column'}>
                                            <Box pr={'2.3vw'}>
                                                <Text fontWeight={'semibold'} fontSize={'20'} color={"var(--settings-head-color)"}>
                                                    Old Password
                                                </Text>
                                                <Stack direction={'row'}>
                                                    <Flex>
                                                        <div
                                                            style={{
                                                                flex: "0 0 50%",
                                                                display: "flex",
                                                                justifyContent: "flex-start",

                                                            }}
                                                        >
                                                            <Box width={'9vw'} pt={'.3vh'} pl={'.1vw'}>
                                                                <Stack direction={'column'}>
                                                                    <Input height={'3.25vh'} fontSize={'18'} color={"var(--text-color)"}
                                                                        value={oldPassword}
                                                                        type={showPassword ? 'text' : 'password'}
                                                                        onChange={(e) => {
                                                                            setOldPassword(e.target.value)
                                                                            if (e.target.value != '' || newPassword != '' || confirmNewPassword != '') {
                                                                                setCloseBoxMessage('Confirm Change')
                                                                            } else {
                                                                                setCloseBoxMessage('Close')
                                                                            }
                                                                        }}
                                                                    >
                                                                    </Input>
                                                                    {
                                                                        (oldPasswordError != '') ?
                                                                            <Text color={'red'} fontSize={'15'}>
                                                                                {oldPasswordError}
                                                                            </Text>
                                                                            :
                                                                            null
                                                                    }
                                                                </Stack>
                                                            </Box>
                                                        </div>
                                                        <div
                                                            style={{
                                                                flex: "0 0 48%",
                                                                display: "flex",
                                                                justifyContent: "flex-end",

                                                            }}
                                                        >
                                                            <Box>
                                                                <Button w={'auto'} h={'auto'} bg={'white'}
                                                                    onClick={() => {
                                                                        setShowPassword(!showPassword);
                                                                    }}
                                                                >
                                                                    <Text pl={'1px'} pr={'1px'} pt={'4px'} pb={'4px'} fontSize={'14'}>
                                                                        {showPassword ? 'Hide' : 'Show'}
                                                                    </Text>
                                                                </Button>
                                                            </Box>
                                                        </div>
                                                    </Flex>
                                                </Stack>
                                            </Box>
                                            <Box>
                                                <Text fontWeight={'semibold'} fontSize={'20'} color={"var(--settings-head-color)"}>
                                                    New Password
                                                </Text>
                                                <Stack direction={'row'}>
                                                    <Flex>
                                                        <div
                                                            style={{
                                                                flex: "0 0 50%",
                                                                display: "flex",
                                                                justifyContent: "flex-start",

                                                            }}
                                                        >
                                                            <Box width={'9vw'} pt={'.3vh'} pl={'.1vw'}>
                                                                <Stack direction={'column'}>
                                                                    <Input height={'3.25vh'} fontSize={'18'} color={"var(--text-color)"}
                                                                        value={newPassword}
                                                                        type={showPassword ? 'text' : 'password'}
                                                                        onChange={(e) => {
                                                                            setNewPassword(e.target.value)
                                                                            if (e.target.value != '' || oldPassword != '' || confirmNewPassword != '') {
                                                                                setCloseBoxMessage('Confirm Change')
                                                                            } else {
                                                                                setCloseBoxMessage('Close')
                                                                            }
                                                                        }}
                                                                        textContentType={"newPassword"}
                                                                    >
                                                                    </Input>
                                                                    {
                                                                        (newPasswordError != '') ?
                                                                            <Text color={'red'} fontSize={'15'}>
                                                                                {newPasswordError}
                                                                            </Text>
                                                                            :
                                                                            null
                                                                    }
                                                                </Stack>
                                                            </Box>

                                                        </div>
                                                        <div
                                                            style={{
                                                                flex: "0 0 48%",
                                                                display: "flex",
                                                                justifyContent: "flex-end",
                                                            }}
                                                        >
                                                            <Box>
                                                                <Button w={'auto'} h={'auto'} bg={'white'}
                                                                    onClick={() => {
                                                                        setShowPassword(!showPassword);
                                                                    }}
                                                                >
                                                                    <Text pl={'1px'} pr={'1px'} pt={'4px'} pb={'4px'} fontSize={'14'}>
                                                                        {showPassword ? 'Hide' : 'Show'}
                                                                    </Text>
                                                                </Button>
                                                            </Box>
                                                        </div>
                                                    </Flex>
                                                </Stack>
                                            </Box>
                                            <Box>
                                                <Text fontWeight={'semibold'} fontSize={'20'} color={"var(--settings-head-color)"}>
                                                    Confirm New Password
                                                </Text>
                                                <Stack direction={'row'}>
                                                    <Flex>
                                                        <div
                                                            style={{
                                                                flex: "0 0 50%",
                                                                display: "flex",
                                                                justifyContent: "flex-start",

                                                            }}
                                                        >
                                                            <Box width={'9vw'} pt={'.3vh'} pl={'.1vw'}>
                                                                <Stack direction={'column'}>
                                                                    <Input height={'3.25vh'} fontSize={'18'} color={"var(--text-color)"}
                                                                        value={confirmNewPassword}
                                                                        type={showPassword ? 'text' : 'password'}
                                                                        onChange={(e) => {
                                                                            setConfirmNewPassword(e.target.value)
                                                                            if (e.target.value != '' || oldPassword != '' || newPassword != '') {
                                                                                setCloseBoxMessage('Confirm Change')
                                                                            } else {
                                                                                setCloseBoxMessage('Close')
                                                                            }
                                                                        }}
                                                                        textContentType={"newPassword"}
                                                                    >
                                                                    </Input>
                                                                    {
                                                                        (confirmNewPasswordError != '') ?
                                                                            <Text color={'red'} fontSize={'15'}>
                                                                                {confirmNewPasswordError}
                                                                            </Text>
                                                                            :
                                                                            null
                                                                    }
                                                                </Stack>
                                                            </Box>

                                                        </div>
                                                        <div
                                                            style={{
                                                                flex: "0 0 48%",
                                                                display: "flex",
                                                                justifyContent: "flex-end",

                                                            }}
                                                        >
                                                            <Box>
                                                                <Button w={'auto'} h={'auto'} bg={'white'}
                                                                    onClick={() => {
                                                                        setShowPassword(!showPassword);
                                                                    }}
                                                                >
                                                                    <Text pl={'1px'} pr={'1px'} pt={'4px'} pb={'4px'} fontSize={'14'}>
                                                                        {showPassword ? 'Hide' : 'Show'}
                                                                    </Text>
                                                                </Button>
                                                            </Box>
                                                        </div>
                                                    </Flex>
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Box>
                            </Stack>
                        </Center>
                    </Stack>
                </Box>
                <Center pb={'2vh'}>
                    <Button borderRadius={'10'} background={'white'} width={closeBoxMessage == 'Close' ? '4vw' : '8vw'} height={'4vh'}
                        onClick={() => {
                            if (closeBoxMessage == 'Close') {
                                console.log('quit');
                                setEditPassword(false);
                                setSettingScreen("profile");
                            }
                            setOldPasswordError('');
                            setNewPasswordError('');
                            setConfirmNewPasswordError('');
                            if (oldPassword === '') {
                                setOldPasswordError('Plese enter your old password');
                            } if (newPassword !== confirmNewPassword) {
                                setNewPasswordError('Passwords does not match');
                                setConfirmNewPasswordError('Passwords does not match');
                            } if (newPassword === '') {
                                setNewPasswordError('Plese enter your new password');
                            } if (confirmNewPassword === '') {
                                setConfirmNewPasswordError('Plese confirm your new password');
                            } else if (oldPassword !== '' && newPassword === confirmNewPassword) {
                                setOldPasswordError('');
                                setNewPasswordError('');
                                setConfirmNewPasswordError('');
                                try {
                                    axios.defaults.headers.common['authorization'] = localStorage.getItem('token')
                                    axios.put('http://localhost:5000/api/resetPassword', {
                                        curPassword: oldPassword,
                                        newPassword: confirmNewPassword,
                                    }).then(res => {
                                        console.log(res);
                                        if (res.data === 'Password successfully updated') {
                                            setEditPassword(false);
                                            setSettingScreen("profile");
                                        } else {
                                            setOldPasswordError('Wrong Password');
                                        }
                                    }).catch(err => {
                                        setOldPasswordError('Wrong Password');
                                    })
                                } catch (err) {
                                
                                }
                            }
                        }
                        }
                    >
                        <Center>
                            <Button minH={'2'} minW={'6'} width={'3vw'} height={'2.5vh'} bg={'white'}>
                                <Text fontSize={'14'} color={'black'}>
                                    {closeBoxMessage}
                                </Text>
                            </Button>
                        </Center>
                    </Button>
                </Center>
            </>
        )

    }
}