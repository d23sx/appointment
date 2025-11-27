package com.iga.mawaeed.service.Excel;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Map;

@Setter
@ToString
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ExportRequest {

    @NotNull(message = "Branch ID is required")
    private Integer branchId;

    @NotBlank(message = "Start date is required")
    private String startDate;

    @NotBlank(message = "End date is required")
    private String endDate;

    @NotBlank(message = "Tab type is required")
    private String tabType;

    // Add filters to specify what data to include and any filter criteria
    private Map<String, Object> filters;


}
