package com.d23sx.mawaeed_backend.Mapper;

import com.d23sx.mawaeed_backend.DTO.UserDto;
import com.d23sx.mawaeed_backend.Entity.User;

public class UserMapper {
    public static UserDto mapToUserDto(User user) {
        if (user == null) {
            return null;
        }
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setArName(user.getArName());
        userDto.setEngName(user.getEngName());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setActive(user.getActive());
        userDto.setUserRoleId(user.getUserRoleId());
        return userDto;
    }

    public static User mapToUser(UserDto userDto) {
        if (userDto == null) {
            return null;
        }
        User user = new User();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setArName(userDto.getArName());
        user.setEngName(userDto.getEngName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setActive(userDto.getActive());
        return user;
    }
}
