
import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    Stack,
    Button,
    IconButton,
    Image,
    Input,
    Flex,
} from '@chakra-ui/react';
import axios from 'axios';

import React, { useEffect, useState } from 'react'









export default function Settings({ user, label }) {

    const [settingScreen, setSettingScreen] = useState('profile')






    const [editName, setEditName] = useState(false);
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

    }, [editPassword])

    console.log(settingScreen === 'profile')
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
                                <Image
                                    borderRadius={'full'}
                                    src="https://picsum.photos/800/1500"
                                    boxSize='4vw'
                                />
                            </Box>
                            <Box pb={'1vh'} pl={'.5vw'}>
                                <Text fontSize={'.8vw'} fontWeight={'bold'} color={"var(--text-color)"}>
                                    {user.firstName} {user.lastName}
                                </Text>
                                <Text pl={'1'} fontSize={'.4vw'} color={"var(--text-color)"}>
                                    @{user.username}
                                </Text>
                            </Box>
                        </Center>
                    </Box>

                    <Center>
                        <Stack p={'2vh'} direction={'column'}>
                            <Box borderRadius={'10'} background={'var(--settings-background-color)'} width={'16vw'} pt={'.3vw'}>
                                <Box p={'.75vw'}>
                                    <Stack direction={'column'}>
                                        <Box>
                                            <Text fontWeight={'semibold'} fontSize={'.7vw'} color={"var(--settings-head-color)"}>
                                                Display Name
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
                                                        {editName ?
                                                            <Box width={'9vw'} pt={'.3vh'} pl={'.1vw'}>
                                                                <Input height={'3.25vh'} fontSize={'.55vw'} color={"var(--text-color)"}
                                                                    value={user.firstName + ' ' + user.lastName}
                                                                >
                                                                </Input>
                                                            </Box>
                                                            :
                                                            <Box width={'9vw'} pt={'.3vh'} pl={'.1vw'}>
                                                                <Text fontSize={'.55vw'} color={"var(--text-color)"}>
                                                                    {user.firstName + ' ' + user.lastName}
                                                                </Text>
                                                            </Box>
                                                        }
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 50%",
                                                            display: "flex",
                                                            justifyContent: "flex-end",

                                                        }}
                                                    >
                                                        <Box style={{ marginLeft: 'auto' }}>
                                                            <Button width={'2vw'} height={'2vh'} bg={'white'}
                                                                onClick={() => {
                                                                    setEditName(!editName);
                                                                }}
                                                            >
                                                                <Text fontSize={'.55vw'}>
                                                                    {editName ? 'Save' : 'Edit'}
                                                                </Text>
                                                            </Button>
                                                        </Box>
                                                    </div>
                                                </Flex>
                                            </Stack>
                                        </Box>
                                        <Box>
                                            <Text fontWeight={'semibold'} fontSize={'.7vw'} color={"var(--settings-head-color)"}>
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
                                                            <Box width={'9vw'} pt={'.3vh'} pl={'.1vw'}>
                                                                <Input height={'3.25vh'} fontSize={'.55vw'} color={"var(--text-color)"}
                                                                    value={user.email}
                                                                >
                                                                </Input>
                                                            </Box>

                                                            :
                                                            <Box width={'9vw'} pt={'.3vh'} pl={'.1vw'}>
                                                                <Text fontSize={'.55vw'} color={"var(--text-color)"}>
                                                                    {user.email}
                                                                </Text>
                                                            </Box>
                                                        }
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 50%",
                                                            display: "flex",
                                                            justifyContent: "flex-end",

                                                        }}
                                                    >
                                                        <Box style={{ marginLeft: 'auto' }}>
                                                            <Button width={'2vw'} height={'2vh'} bg={'white'}
                                                                onClick={() => {
                                                                    setEditEmail(!editEmail);
                                                                }}
                                                            >
                                                                <Text fontSize={'.55vw'}>
                                                                    {editEmail ? 'Save' : 'Edit'}
                                                                </Text>
                                                            </Button>
                                                        </Box>
                                                    </div>
                                                </Flex>
                                            </Stack>
                                        </Box>
                                        <Box>
                                            <Text fontWeight={'semibold'} fontSize={'.7vw'} color={"var(--settings-head-color)"}>
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
                                                        <Box width={'9vw'} pt={'.3vh'} pl={'.1vw'}>
                                                            <Text fontSize={'.55vw'} color={"var(--text-color)"}>
                                                                {"**********"}
                                                            </Text>
                                                        </Box>
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 50%",
                                                            display: "flex",
                                                            justifyContent: "flex-end",

                                                        }}
                                                    >
                                                        <Box style={{ marginLeft: 'auto' }}>
                                                            <Button width={'2.75vw'} height={'2vh'} bg={'white'}
                                                                onClick={() => {
                                                                    setEditPassword(!editPassword);
                                                                    setSettingScreen("password");
                                                                }}
                                                            >
                                                                <Text fontSize={'.55vw'}>
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
                            <Box borderRadius={'10'} background={'var(--settings-background-color)'} width={'16vw'} pt={'.3vw'}>
                                <Box p={'.75vw'}>
                                    <Stack direction={'column'}>
                                        <Box>
                                            <Text fontWeight={'semibold'} fontSize={'.7vw'} color={"var(--settings-head-color)"}>
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
                                                        <Box width={'9vw'} pt={'.3vh'} pl={'.1vw'}>
                                                            <Text fontSize={'.55vw'} color={"var(--text-color)"}>
                                                                {"Permanently delete your account"}
                                                            </Text>
                                                        </Box>
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 48%",
                                                            display: "flex",
                                                            justifyContent: "flex-end",

                                                        }}
                                                    >
                                                        <Box style={{ marginLeft: 'auto' }}>
                                                            <Button bg={'red'} width={'3vw'} height={'3vh'}
                                                                onClick={() => {
                                                                    setSettingScreen("deleteAccount");
                                                                }}
                                                            >
                                                                <Text color={'white'} fontSize={'.55vw'}>
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
                        </Stack>
                    </Center>
                </Stack>
            </Box>
        )
    } else if (settingScreen === 'password') {
        return (
            <>
                <Box>
                    <Stack direction={'column'}>
                        <Center>
                            <Text fontSize={'1.25vw'} color={'var(--text-color)'}>
                                Change Password
                            </Text>
                        </Center>
                        <Box pt={'5vh'}>
                            <Center>
                                <Box>
                                    <Image
                                        borderRadius={'full'}
                                        src="https://picsum.photos/800/1500"
                                        boxSize='4vw'
                                    />
                                </Box>
                                <Box pb={'1vh'} pl={'.5vw'}>
                                    <Text fontSize={'.8vw'} fontWeight={'bold'} color={"var(--text-color)"}>
                                        {user.firstName} {user.lastName}
                                    </Text>
                                    <Text pl={'1'} fontSize={'.4vw'} color={"var(--text-color)"}>
                                        @{user.username}
                                    </Text>
                                </Box>
                            </Center>
                        </Box>

                        <Center>
                            <Stack p={'2vh'} direction={'column'}>
                                <Box borderRadius={'10'} background={'var(--settings-background-color)'} width={'16vw'} pt={'.3vw'}>
                                    <Box p={'.75vw'}>
                                        <Stack direction={'column'}>
                                            <Box>
                                                <Text fontWeight={'semibold'} fontSize={'.7vw'} color={"var(--settings-head-color)"}>
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
                                                                    <Input height={'3.25vh'} fontSize={'.55vw'} color={"var(--text-color)"}
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
                                                                            <Text color={'red'} fontSize={'.55vw'}>
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
                                                                flex: "0 0 50%",
                                                                display: "flex",
                                                                justifyContent: "flex-end",

                                                            }}
                                                        >
                                                            <Box style={{ marginLeft: 'auto' }}>
                                                                <Button width={'2vw'} height={'2vh'} bg={'white'}
                                                                    onClick={() => {
                                                                        setShowPassword(!showPassword);
                                                                    }}
                                                                >
                                                                    <Text fontSize={'.55vw'}>
                                                                        {showPassword ? 'Hide' : 'Show'}
                                                                    </Text>
                                                                </Button>
                                                            </Box>
                                                        </div>
                                                    </Flex>
                                                </Stack>
                                            </Box>
                                            <Box>
                                                <Text fontWeight={'semibold'} fontSize={'.7vw'} color={"var(--settings-head-color)"}>
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
                                                                    <Input height={'3.25vh'} fontSize={'.55vw'} color={"var(--text-color)"}
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
                                                                            <Text color={'red'} fontSize={'.55vw'}>
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
                                                                flex: "0 0 50%",
                                                                display: "flex",
                                                                justifyContent: "flex-end",

                                                            }}
                                                        >
                                                            <Box style={{ marginLeft: 'auto' }}>
                                                                <Button width={'2vw'} height={'2vh'} bg={'white'}
                                                                    onClick={() => {
                                                                        setShowPassword(!showPassword);
                                                                    }}
                                                                >
                                                                    <Text fontSize={'.55vw'}>
                                                                        {showPassword ? 'Hide' : 'Show'}
                                                                    </Text>
                                                                </Button>
                                                            </Box>
                                                        </div>
                                                    </Flex>
                                                </Stack>
                                            </Box>
                                            <Box>
                                                <Text fontWeight={'semibold'} fontSize={'.7vw'} color={"var(--settings-head-color)"}>
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
                                                                    <Input height={'3.25vh'} fontSize={'.55vw'} color={"var(--text-color)"}
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
                                                                            <Text color={'red'} fontSize={'.55vw'}>
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
                                                                flex: "0 0 50%",
                                                                display: "flex",
                                                                justifyContent: "flex-end",

                                                            }}
                                                        >
                                                            <Box style={{ marginLeft: 'auto' }}>
                                                                <Button width={'2vw'} height={'2vh'} bg={'white'}
                                                                    onClick={() => {
                                                                        setShowPassword(!showPassword);
                                                                    }}
                                                                >
                                                                    <Text fontSize={'.55vw'}>
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
                    <Button borderRadius={'10'} background={'var(--settings-background-color)'} width={closeBoxMessage == 'Close' ? '4vw' : '8vw'} height={'4vh'}
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
                                axios.post('https://localhost:5000/api/changePassword', {
                                    email: user.email,
                                    password: confirmNewPassword,
                                })
                            }
                        }
                        }
                    >
                        <Center>
                            <Button color={'white'}>
                                <Text color={'black'}>
                                    {closeBoxMessage}
                                </Text>
                            </Button>
                        </Center>
                    </Button>
                </Center>
            </>
        )

    } else if (settingScreen === 'deleteAccount') {
        return (
            <></>
        )
    }
}