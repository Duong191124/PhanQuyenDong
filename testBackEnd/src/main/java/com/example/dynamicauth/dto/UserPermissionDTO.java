package com.example.dynamicauth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class UserPermissionDTO {
    @JsonProperty("permissionIds")
    private List<Integer> permissionIds;
}
