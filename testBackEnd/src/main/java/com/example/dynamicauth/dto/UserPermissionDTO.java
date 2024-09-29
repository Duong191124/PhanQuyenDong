package com.example.dynamicauth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class UserPermissionDTO {
    @JsonProperty("permissionToAdd")
    private List<Integer> permissionToAdd;
    
    @JsonProperty("permissionToRemove")
    private List<Integer> permissionToRemove;
}
