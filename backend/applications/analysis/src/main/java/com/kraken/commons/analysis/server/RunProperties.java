package com.kraken.commons.analysis.server;

import lombok.Builder;
import lombok.NonNull;
import lombok.Value;

@Value
@Builder
public class RunProperties {

  @NonNull
  String root;
  @NonNull
  String script;
  @NonNull
  String cancelScript;

}